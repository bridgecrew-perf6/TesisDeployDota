var tblUsers;
var user;
var fv;

function getData() {
    tblUsers = $('#data').DataTable({
        responsive: true,
        autoWidth: false,
        destroy: true,
        ajax: {
            url: pathname,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: {
                'action': 'search'
            },
            dataSrc: ""
        },
        columns: [
            {"data": "id"},
            {"data": "user.last_name"},
            {"data": "representate.last_name"},
            {"data": "user.email"},
            {"data": "id"},
        ],
        columnDefs: [
            {
                targets: [-3],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<img class="img-fluid mx-auto d-block" src="' + data + '" width="20px" height="20px">';
                }
            },
            {
                targets: [-4],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    if (data) {
                        return '<span class="badge badge-success">Activo</span>';
                    }
                    return '<span class="badge badge-danger">Inactivo</span>';
                }
            },
            {
                targets: [-2],
                class: 'text-center',
                render: function (data, type, row) {
                    var html = '';
                    $.each(row.groups, function (key, value) {
                        html += '<span class="badge badge-success">' + value.name + '</span> ';
                    });
                    return html;
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    var content = '<div class="btn-group" role="group"><button id="btnGroupDrop1" type="button" class="btn btn-secondary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-align-justify"></i> Opciones</button><div class="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">';
                    content += '<a class="dropdown-item" href="/user/update/' + row.id + '/"><i class="fas fa-edit"></i> Editar</a>';
                    content += '<a class="dropdown-item" href="/user/delete/' + row.id + '/"><i class="fas fa-trash"></i> Eliminar</a>';
                    content += '<a class="dropdown-item" rel="search_access"><i class="fas fa-user-secret"></i> Ver accesos</a>';
                    content += '<a class="dropdown-item" rel="login_with_user"><i class="fas fa-globe"></i> Ingresar al sistema</a>';
                    content += '<a class="dropdown-item" rel="reset_password"><i class="fas fa-unlock-alt"></i> Resetear clave</a>';
                    content += '<a class="dropdown-item" rel="change_password"><i class="fas fa-lock"></i> Cambiar password</a>';
                    content += '</div></div>';
                    return content;
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
}

document.addEventListener('DOMContentLoaded', function (e) {
    var form = document.getElementById('frmChangePasswordByUser');
    fv = FormValidation.formValidation(form, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                password: {
                    validators: {
                        notEmpty: {
                            message: 'El password es requerido'
                        },
                    }
                },
            },
        }
    )
        .on('core.element.validated', function (e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fv.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function (e) {
            if (!e.result.valid) {
                const messages = [].slice.call(form.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function () {
            var parameters = new FormData($(form)[0]);
            parameters.append('action', 'change_password');
            parameters.append('id', user.id);
            submit_formdata_with_ajax('Notificación',
                '¿Estas seguro de cambiar la clave?',
                pathname,
                parameters,
                function () {
                    location.href = pathname;
                });
        });
});

$(function () {

    getData();

    $('#data tbody')
        .on('click', 'a[rel="search_access"]', function () {
            var tr = tblUsers.cell($(this).closest('td, li')).index(),
                row = tblUsers.row(tr.row).data();
            $('#tblAccessUsers').DataTable({
                destroy: true,
                responsive: true,
                autoWidth: false,
                ajax: {
                    url: pathname,
                    type: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    data: {
                        'action': 'search_access',
                        'id': row.id
                    },
                    dataSrc: ""
                },
                columns: [
                    {"data": "id"},
                    {"data": "date_joined"},
                    {"data": "hour"},
                    {"data": "localhost"},
                    {"data": "location"},
                ],
                columnDefs: [
                    {orderable: false, targets: ['_all']}
                ]
            });
            $('#myModalAccessUsers').modal('show');
        })
        .on('click', 'a[rel="reset_password"]', function () {
            var tr = tblUsers.cell($(this).closest('td, li')).index(),
                row = tblUsers.row(tr.row).data();
            submit_with_ajax('Notificación',
                '¿Estas seguro de resetear la clave?',
                pathname, {
                    'id': row.id,
                    'action': 'reset_password'
                },
                function () {
                    location.reload();
                }
            );
        })
        .on('click', 'a[rel="login_with_user"]', function () {
            var tr = tblUsers.cell($(this).closest('td, li')).index(),
                row = tblUsers.row(tr.row).data();
            submit_with_ajax('Notificación',
                '¿Estas seguro de iniciar sesión con este usuario?',
                pathname, {
                    'id': row.id,
                    'action': 'login_with_user'
                },
                function () {
                    location.href = '/';
                },
            );
        })
        .on('click', 'a[rel="change_password"]', function () {
            var tr = tblUsers.cell($(this).closest('td, li')).index();
            user = tblUsers.row(tr.row).data();
            $('#myModalChangePasswordByUser').modal('show');
        })

    $('#myModalChangePasswordByUser').on('hidden.bs.modal', function () {
        fv.resetForm(true);
    });
});

