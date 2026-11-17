(function () {
    'use strict';

    var USERS = {
        'admin@dormis.test': { password: 'admin123', role: 'admin', name: 'Dormis Admin' },
        'boarder@dormis.test': { password: 'boarder123', role: 'boarder', name: 'Yuan Kester' }
    };
    var rooms = [
        { number: 'A-101', type: 'Standard Shared', capacity: 4, occupied: 3, rate: 4500, status: 'Available' },
        { number: 'A-102', type: 'Standard Shared', capacity: 4, occupied: 4, rate: 4500, status: 'Full' },
        { number: 'B-204', type: 'Premium Shared', capacity: 3, occupied: 2, rate: 5600, status: 'Available' },
        { number: 'C-301', type: 'Solo Room', capacity: 1, occupied: 1, rate: 8500, status: 'Full' },
        { number: 'D-110', type: 'Maintenance Hold', capacity: 2, occupied: 0, rate: 5000, status: 'Unavailable' }
    ];
    var boarders = [
        { id: 201, name: 'Yuan Kester', email: 'boarder@dormis.test', phone: '0917 502 1140', room: 'B-204', move_in: '2026-06-01', guardian: 'Maria Evangelista', emergency_phone: '0918 330 7712', status: 'Active' },
        { id: 202, name: 'James Robertson', email: 'james@dormis.test', phone: '0920 114 9090', room: 'A-101', move_in: '2026-06-10', guardian: 'Robert Serna', emergency_phone: '0916 772 1180', status: 'Active' },
        { id: 203, name: 'Mika Santos', email: 'mika@dormis.test', phone: '0915 678 2200', room: 'A-102', move_in: '2026-05-18', guardian: 'Liza Santos', emergency_phone: '0917 450 6633', status: 'Active' },
        { id: 204, name: 'Andrei Cruz', email: 'andrei@dormis.test', phone: '0999 441 2210', room: 'C-301', move_in: '2026-04-27', guardian: 'Tomas Cruz', emergency_phone: '0922 881 5541', status: 'Active' }
    ];
    var bills = [
        { id: 'BILL-2607-001', boarder_id: 201, boarder: 'Yuan Kester', room: 'B-204', period: 'July 2026', rent: 5600, utilities: 850, due_date: '2026-07-15', status: 'Unpaid' },
        { id: 'BILL-2607-002', boarder_id: 202, boarder: 'James Robertson', room: 'A-101', period: 'July 2026', rent: 4500, utilities: 740, due_date: '2026-07-15', status: 'Paid' },
        { id: 'BILL-2607-003', boarder_id: 203, boarder: 'Mika Santos', room: 'A-102', period: 'July 2026', rent: 4500, utilities: 690, due_date: '2026-07-15', status: 'Overdue' },
        { id: 'BILL-2606-001', boarder_id: 201, boarder: 'Yuan Kester', room: 'B-204', period: 'June 2026', rent: 5600, utilities: 805, due_date: '2026-06-15', status: 'Paid' }
    ];
    var requests = [
        { id: 'REQ-1042', boarder_id: 201, boarder: 'Yuan Kester', room: 'B-204', category: 'Plumbing', title: 'Sink drains slowly', date: '2026-07-02', priority: 'Normal', status: 'In Progress' },
        { id: 'REQ-1041', boarder_id: 202, boarder: 'James Robertson', room: 'A-101', category: 'Electrical', title: 'Outlet near desk is loose', date: '2026-07-01', priority: 'High', status: 'Pending' },
        { id: 'REQ-1037', boarder_id: 203, boarder: 'Mika Santos', room: 'A-102', category: 'Furniture', title: 'Cabinet hinge replacement', date: '2026-06-28', priority: 'Low', status: 'Resolved' },
        { id: 'REQ-1034', boarder_id: 201, boarder: 'Yuan Kester', room: 'B-204', category: 'Internet', title: 'Weak Wi-Fi signal', date: '2026-06-24', priority: 'Normal', status: 'Resolved' }
    ];

    var root = document.getElementById('app');
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var user = readUser();
    var adminPages = [
        ['dashboard', 'Dashboard', '/admin/dashboard'], ['rooms', 'Rooms', '/admin/rooms'],
        ['boarders', 'Boarders', '/admin/boarders'], ['billing', 'Billing', '/admin/billing'],
        ['maintenance', 'Maintenance', '/admin/maintenance']
    ];
    var boarderPages = [
        ['dashboard', 'Dashboard', '/boarder/dashboard'], ['profile', 'Profile', '/boarder/profile'],
        ['bills', 'Bills', '/boarder/bills'], ['maintenance', 'Maintenance', '/boarder/maintenance']
    ];

    function readUser() {
        try { return JSON.parse(localStorage.getItem('dormis-demo-user') || 'null'); }
        catch (error) { return null; }
    }

    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
        });
    }

    function money(value) {
        return 'PHP ' + Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function badge(value) {
        return '<span class="dormis-badge dormis-badge--' + esc(String(value).toLowerCase().replace(/\s+/g, '-')) + '">' + esc(value) + '</span>';
    }

    function initials(name) {
        return String(name || 'D').trim().split(/\s+/).slice(0, 2).map(function (part) { return part.charAt(0); }).join('').toUpperCase() || 'D';
    }

    function stat(label, value, note) {
        return '<div class="col-sm-6 col-xl-3 mb-4"><div class="stat-card"><span>' + label + '</span><strong>' + value + '</strong><small>' + note + '</small></div></div>';
    }

    function tablePanel(title, subtitle, id, headers, rows, searchable) {
        return '<div class="table-panel"><div class="section-title"><div><h2 class="h4">' + title + '</h2><p>' + subtitle + '</p></div>' +
            (searchable ? '<input class="form-control" style="max-width:260px" type="search" placeholder="Search ' + title.toLowerCase() + '" data-table-filter="#' + id + '">' : '') +
            '</div><div class="table-responsive"><table class="table" id="' + id + '"><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') +
            '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div></div>';
    }

    function draftForm(title, description, fields, button) {
        return '<form class="dormis-panel" data-draft-form><div class="section-title"><div><h2 class="h4">' + title + '</h2><p>' + description + '</p></div></div>' + fields +
            '<button class="btn btn-primary btn-block" type="submit">' + button + '</button><div class="draft-message mt-3"></div></form>';
    }

    function field(label, id, type, value, required, placeholder) {
        return '<div class="form-group"><label for="' + id + '">' + label + '</label><input class="form-control" id="' + id + '" type="' + (type || 'text') + '"' +
            (value != null ? ' value="' + esc(value) + '"' : '') + (placeholder ? ' placeholder="' + esc(placeholder) + '"' : '') + (required ? ' required' : '') + '></div>';
    }

    function selectField(label, id, options) {
        return '<div class="form-group"><label for="' + id + '">' + label + '</label><select class="custom-select" id="' + id + '" required>' + options.map(function (option) {
            return '<option>' + esc(option) + '</option>';
        }).join('') + '</select></div>';
    }

    function renderLogin() {
        document.title = 'Login | Dormis';
        document.body.className = 'login-page';
        root.innerHTML = '<main class="container"><div class="login-card"><div class="row no-gutters"><section class="col-lg-6 login-brand d-flex align-items-center"><div class="login-copy">' +
            '<img src="/assets/img/dormis-brand.png" alt="Dormis"><h1 class="h2 font-weight-bold mt-4">Easing dorm life for admins and boarders.</h1>' +
            '<p class="text-muted mb-0">This first draft lets you test the look, navigation, and role-based flow before connecting MySQL.</p></div></section>' +
            '<section class="col-lg-6 p-5 login-form-wrap"><p class="eyebrow">School project preview</p><h2 class="font-weight-bold mb-4">Sign in to Dormis</h2>' +
            '<div class="alert alert-danger d-none" role="alert" data-login-error>Enter a valid demo account and password.</div>' +
            '<form data-login-form><div class="form-group"><label for="email">Email address</label><input class="form-control" type="email" id="email" name="email" required autocomplete="email"></div>' +
            '<div class="form-group"><label for="password">Password</label><input class="form-control" type="password" id="password" name="password" required autocomplete="current-password"></div>' +
            '<button class="btn btn-primary btn-block btn-lg" type="submit">Log in</button></form><div class="credential-box mt-4"><strong>Draft accounts</strong><div class="row mt-3">' +
            '<div class="col-md-6 mb-2"><button type="button" class="btn btn-outline-primary btn-block" data-fill-login data-email="admin@dormis.test" data-password="admin123">Use admin</button><small class="text-muted d-block mt-2">admin@dormis.test<br>admin123</small></div>' +
            '<div class="col-md-6 mb-2"><button type="button" class="btn btn-outline-primary btn-block" data-fill-login data-email="boarder@dormis.test" data-password="boarder123">Use boarder</button><small class="text-muted d-block mt-2">boarder@dormis.test<br>boarder123</small></div>' +
            '</div></div></section></div></div></main>';
        root.querySelector('[data-login-form]').addEventListener('submit', function (event) {
            event.preventDefault();
            var email = root.querySelector('#email').value.trim().toLowerCase();
            var password = root.querySelector('#password').value;
            var account = USERS[email];
            if (!account || account.password !== password) {
                root.querySelector('[data-login-error]').classList.remove('d-none');
                return;
            }
            localStorage.setItem('dormis-demo-user', JSON.stringify({ email: email, role: account.role, name: account.name }));
            window.location.href = '/' + account.role + '/dashboard';
        });
        root.querySelectorAll('[data-fill-login]').forEach(function (button) {
            button.addEventListener('click', function () {
                root.querySelector('#email').value = button.dataset.email;
                root.querySelector('#password').value = button.dataset.password;
            });
        });
    }

    function adminContent(key) {
        var roomRows = rooms.map(function (r) {
            var percent = Math.min(100, Math.round(r.occupied / r.capacity * 100));
            return '<tr><td><strong>' + r.number + '</strong></td><td>' + r.type + '</td><td><div class="d-flex justify-content-between"><span>' + r.occupied + '/' + r.capacity + '</span><small class="text-muted">' + percent + '%</small></div><div class="progress mt-1" style="height:8px"><div class="progress-bar" style="width:' + percent + '%"></div></div></td><td>' + badge(r.status) + '</td></tr>';
        });
        if (key === 'dashboard') {
            var slots = rooms.reduce(function (sum, r) { return sum + Math.max(0, r.capacity - r.occupied); }, 0);
            var unpaid = bills.filter(function (b) { return b.status !== 'Paid'; }).length;
            var pending = requests.filter(function (r) { return r.status === 'Pending' || r.status === 'In Progress'; }).length;
            return '<div class="row">' + stat('Total rooms', rooms.length, 'Across all dorm sections') + stat('Available slots', slots, 'Ready for assignment') + stat('Active boarders', boarders.length, 'Currently registered') + stat('Needs attention', unpaid + pending, unpaid + ' bills, ' + pending + ' requests') + '</div><div class="row"><div class="col-lg-8 mb-4">' +
                tablePanel('Room occupancy', 'Quick view of room capacity and availability.', 'roomsTable', ['Room', 'Type', 'Occupancy', 'Status'], roomRows, false) + '</div><div class="col-lg-4 mb-4"><div class="dormis-panel"><div class="section-title"><div><h2 class="h4">Maintenance queue</h2><p>Recent boarder reports.</p></div></div><ul class="soft-list">' +
                requests.slice(0, 3).map(function (r) { return '<li><div class="d-flex justify-content-between"><strong>' + r.title + '</strong>' + badge(r.status) + '</div><small class="text-muted">' + r.room + ' by ' + r.boarder + '</small></li>'; }).join('') + '</ul><a class="btn btn-outline-primary btn-block mt-3" href="/admin/maintenance">View requests</a></div></div></div>';
        }
        if (key === 'rooms') {
            return '<div class="row"><div class="col-xl-8 mb-4">' + tablePanel('Rooms', 'Create, update, and review room availability.', 'roomsTable', ['Room', 'Type', 'Capacity', 'Rate', 'Status', 'Draft actions'], rooms.map(function (r) { return '<tr><td><strong>' + r.number + '</strong></td><td>' + r.type + '</td><td>' + r.occupied + '/' + r.capacity + '</td><td>' + money(r.rate) + '</td><td>' + badge(r.status) + '</td><td><button class="btn btn-sm btn-outline-primary" type="button">Edit</button> <button class="btn btn-sm btn-outline-secondary" type="button">Archive</button></td></tr>'; }), true) + '</div><div class="col-xl-4 mb-4">' + draftForm('Add room', 'Preview form for admin room CRUD.', field('Room number', 'roomNumber', 'text', null, true, 'Example: E-205') + selectField('Room type', 'roomType', ['Standard Shared', 'Premium Shared', 'Solo Room']) + '<div class="form-row"><div class="form-group col-6"><label for="capacity">Capacity</label><input class="form-control" id="capacity" type="number" min="1" value="4" required></div><div class="form-group col-6"><label for="rate">Monthly rate</label><input class="form-control" id="rate" type="number" min="0" value="4500" required></div></div>' + selectField('Status', 'roomStatus', ['Available', 'Full', 'Unavailable']), 'Save room draft') + '</div></div>';
        }
        if (key === 'boarders') {
            return '<div class="row"><div class="col-xl-8 mb-4">' + tablePanel('Registered boarders', 'Only admins can create boarder accounts.', 'boardersTable', ['Name', 'Contact', 'Room', 'Move-in', 'Status', 'Draft actions'], boarders.map(function (b) { return '<tr><td><strong>' + b.name + '</strong><br><small class="text-muted">' + b.email + '</small></td><td>' + b.phone + '</td><td>' + b.room + '</td><td>' + b.move_in + '</td><td>' + badge(b.status) + '</td><td><button class="btn btn-sm btn-outline-primary" type="button">Edit</button> <button class="btn btn-sm btn-outline-secondary" type="button">View</button></td></tr>'; }), true) + '</div><div class="col-xl-4 mb-4">' + draftForm('Create boarder', 'Account and profile details in one admin form.', field('Full name', 'fullName', 'text', null, true) + field('Email address', 'newEmail', 'email', null, true) + '<div class="form-row"><div class="form-group col-md-6"><label for="phone">Phone</label><input class="form-control" id="phone" required></div><div class="form-group col-md-6"><label for="room">Assign room</label><select class="custom-select" id="room" required>' + rooms.map(function (r) { return '<option>' + r.number + '</option>'; }).join('') + '</select></div></div>' + field('Emergency contact', 'guardian', 'text', null, true), 'Create account draft') + '</div></div>';
        }
        if (key === 'billing') {
            var outstanding = bills.reduce(function (sum, b) { return sum + (b.status === 'Paid' ? 0 : b.rent + b.utilities); }, 0);
            return '<div class="row">' + stat('Outstanding balance', money(outstanding), 'Preview total from sample records') + stat('Paid bills', bills.filter(function (b) { return b.status === 'Paid'; }).length, 'Marked paid this draft') + stat('Overdue bills', bills.filter(function (b) { return b.status === 'Overdue'; }).length, 'Needs admin follow-up') + '</div><div class="row"><div class="col-xl-8 mb-4">' + tablePanel('Billing records', 'Monthly rent and utilities monitoring.', 'billingTable', ['Bill ID', 'Boarder', 'Period', 'Total', 'Due', 'Status', 'Draft actions'], bills.map(function (b) { return '<tr><td><strong>' + b.id + '</strong></td><td>' + b.boarder + '<br><small class="text-muted">' + b.room + '</small></td><td>' + b.period + '</td><td>' + money(b.rent + b.utilities) + '</td><td>' + b.due_date + '</td><td>' + badge(b.status) + '</td><td><button class="btn btn-sm btn-outline-primary" type="button">Mark paid</button></td></tr>'; }), true) + '</div><div class="col-xl-4 mb-4">' + draftForm('Generate bill', 'Admin billing draft before MySQL storage.', selectField('Boarder', 'billBoarder', boarders.map(function (b) { return b.name + ' - ' + b.room; })) + field('Billing period', 'period', 'text', 'August 2026', true) + '<div class="form-row"><div class="form-group col-6"><label for="rent">Rent</label><input class="form-control" id="rent" type="number" min="0" value="4500" required></div><div class="form-group col-6"><label for="utilities">Utilities</label><input class="form-control" id="utilities" type="number" min="0" value="700" required></div></div>' + field('Due date', 'dueDate', 'date', '2026-08-15', true), 'Save billing draft') + '</div></div>';
        }
        return '<div class="row"><div class="col-xl-8 mb-4">' + tablePanel('Request queue', 'Review, prioritize, and update maintenance status.', 'maintenanceTable', ['Request', 'Boarder', 'Category', 'Priority', 'Status', 'Draft actions'], requests.map(function (r) { return '<tr><td><strong>' + r.title + '</strong><br><small class="text-muted">' + r.id + ' on ' + r.date + '</small></td><td>' + r.boarder + '<br><small class="text-muted">' + r.room + '</small></td><td>' + r.category + '</td><td>' + badge(r.priority) + '</td><td>' + badge(r.status) + '</td><td><button class="btn btn-sm btn-outline-primary" type="button">Update</button></td></tr>'; }), true) + '</div><div class="col-xl-4 mb-4">' + draftForm('Update status', 'Admin response draft for maintenance tracking.', selectField('Request', 'requestId', requests.map(function (r) { return r.id + ' - ' + r.title; })) + selectField('New status', 'status', ['Pending', 'In Progress', 'Resolved']) + '<div class="form-group"><label for="adminNote">Admin note</label><textarea class="form-control" id="adminNote" rows="4" placeholder="Add repair notes for the boarder"></textarea></div>', 'Update request draft') + '</div></div>';
    }

    function boarderContent(key) {
        var boarder = boarders[0];
        var myBills = bills.filter(function (b) { return b.boarder_id === boarder.id; });
        var myRequests = requests.filter(function (r) { return r.boarder_id === boarder.id; });
        if (key === 'dashboard') {
            var currentBill = myBills[0];
            return '<div class="row"><div class="col-md-4 mb-4"><div class="stat-card"><span>Assigned room</span><strong>' + boarder.room + '</strong><small>Move-in date: ' + boarder.move_in + '</small></div></div><div class="col-md-4 mb-4"><div class="stat-card"><span>Current bill</span><strong>' + money(currentBill.rent + currentBill.utilities) + '</strong><small>' + badge(currentBill.status) + '</small></div></div><div class="col-md-4 mb-4"><div class="stat-card"><span>Maintenance requests</span><strong>' + myRequests.length + '</strong><small>Your submitted reports</small></div></div></div><div class="row"><div class="col-lg-7 mb-4"><div class="dormis-panel"><div class="section-title"><div><h2 class="h4">My room and billing</h2><p>A boarder-only view of personal dorm details.</p></div></div><dl class="row mb-0"><dt class="col-sm-4">Name</dt><dd class="col-sm-8">' + boarder.name + '</dd><dt class="col-sm-4">Room</dt><dd class="col-sm-8">' + boarder.room + '</dd><dt class="col-sm-4">Contact</dt><dd class="col-sm-8">' + boarder.phone + '</dd><dt class="col-sm-4">Emergency contact</dt><dd class="col-sm-8">' + boarder.guardian + ', ' + boarder.emergency_phone + '</dd></dl></div></div><div class="col-lg-5 mb-4"><div class="dormis-panel"><div class="section-title"><div><h2 class="h4">Recent maintenance</h2><p>Status updates from the dorm admin.</p></div></div><ul class="soft-list">' + myRequests.map(function (r) { return '<li><div class="d-flex justify-content-between"><strong>' + r.title + '</strong>' + badge(r.status) + '</div><small class="text-muted">' + r.category + ' submitted ' + r.date + '</small></li>'; }).join('') + '</ul></div></div></div>';
        }
        if (key === 'profile') {
            return '<div class="row"><div class="col-lg-5 mb-4"><div class="dormis-panel"><div class="d-flex align-items-center mb-4"><div class="avatar mr-3">' + initials(boarder.name) + '</div><div><h2 class="h4 mb-1">' + boarder.name + '</h2><p class="text-muted mb-0">' + boarder.email + '</p></div></div><dl class="row mb-0"><dt class="col-sm-5">Boarder ID</dt><dd class="col-sm-7">' + boarder.id + '</dd><dt class="col-sm-5">Room</dt><dd class="col-sm-7">' + boarder.room + '</dd><dt class="col-sm-5">Phone</dt><dd class="col-sm-7">' + boarder.phone + '</dd><dt class="col-sm-5">Status</dt><dd class="col-sm-7">' + badge(boarder.status) + '</dd></dl></div></div><div class="col-lg-7 mb-4">' + draftForm('Update contact details', 'Boarders can update personal and emergency information.', '<div class="form-row"><div class="form-group col-md-6"><label for="phone">Phone number</label><input class="form-control" id="phone" value="' + boarder.phone + '" required></div><div class="form-group col-md-6"><label for="email">Email address</label><input class="form-control" id="email" type="email" value="' + boarder.email + '" required></div></div><div class="form-row"><div class="form-group col-md-6"><label for="guardian">Emergency contact</label><input class="form-control" id="guardian" value="' + boarder.guardian + '" required></div><div class="form-group col-md-6"><label for="emergencyPhone">Emergency phone</label><input class="form-control" id="emergencyPhone" value="' + boarder.emergency_phone + '" required></div></div>', 'Save profile draft') + '</div></div>';
        }
        if (key === 'bills') {
            return tablePanel('Billing history', 'Boarders can view rent, utilities, due dates, and payment status.', 'myBillsTable', ['Bill ID', 'Period', 'Rent', 'Utilities', 'Total', 'Due date', 'Status'], myBills.map(function (b) { return '<tr><td><strong>' + b.id + '</strong></td><td>' + b.period + '</td><td>' + money(b.rent) + '</td><td>' + money(b.utilities) + '</td><td>' + money(b.rent + b.utilities) + '</td><td>' + b.due_date + '</td><td>' + badge(b.status) + '</td></tr>'; }), true) + '<div class="empty-note mt-3">Payment buttons are intentionally not active yet. The next backend phase will connect bill records to MySQL.</div>';
        }
        return '<div class="row"><div class="col-lg-7 mb-4">' + tablePanel('My requests', 'Track submitted maintenance issues.', 'myRequestsTable', ['Request', 'Category', 'Date', 'Status'], myRequests.map(function (r) { return '<tr><td><strong>' + r.title + '</strong><br><small class="text-muted">' + r.id + '</small></td><td>' + r.category + '</td><td>' + r.date + '</td><td>' + badge(r.status) + '</td></tr>'; }), false) + '</div><div class="col-lg-5 mb-4">' + draftForm('Submit request', 'Report facility issues to the dorm admin.', selectField('Category', 'category', ['Plumbing', 'Electrical', 'Furniture', 'Internet', 'Cleaning']) + field('Short title', 'title', 'text', null, true, 'Example: AC is not cooling') + '<div class="form-group"><label for="details">Details</label><textarea class="form-control" id="details" rows="5" required placeholder="Describe the issue clearly"></textarea></div>', 'Submit request draft') + '</div></div>';
    }

    function renderApp(role, key) {
        var pages = role === 'admin' ? adminPages : boarderPages;
        var active = pages.find(function (page) { return page[0] === key; }) || pages[0];
        document.title = active[1] + ' | Dormis';
        document.body.className = 'app-body';
        root.innerHTML = '<div class="mobile-scrim" data-sidebar-close></div><div class="app-shell"><aside class="app-sidebar" id="appSidebar"><div class="sidebar-brand"><img src="/assets/img/dormis-brand.png" alt="Dormis"></div><div class="sidebar-label">' + (role === 'admin' ? 'Admin Workspace' : 'Boarder Portal') + '</div><nav class="app-nav">' +
            pages.map(function (page) { return '<a class="app-nav-link' + (page[0] === active[0] ? ' active' : '') + '" href="' + page[2] + '">' + page[1] + '</a>'; }).join('') +
            '</nav><div class="sidebar-footer"><div class="user-mini"><div class="avatar">' + initials(user.name) + '</div><div><strong>' + esc(user.name) + '</strong><span>' + role.charAt(0).toUpperCase() + role.slice(1) + '</span></div></div><a class="btn btn-outline-primary btn-block btn-sm mt-3" href="/logout">Log out</a></div></aside><main class="app-main"><header class="topbar"><button type="button" class="sidebar-toggle" data-sidebar-toggle aria-label="Open navigation"><span></span><span></span><span></span></button><div><p class="eyebrow mb-1">' + (role === 'admin' ? 'Dormitory operations' : 'My dorm space') + '</p><h1>' + active[1] + '</h1></div><div class="topbar-pill d-none d-md-flex">Initial UI draft</div></header><section class="content-wrap">' + (role === 'admin' ? adminContent(active[0]) : boarderContent(active[0])) + '</section></main></div>';
        root.querySelector('[data-sidebar-toggle]').addEventListener('click', function () { document.body.classList.toggle('sidebar-open'); });
        root.querySelector('[data-sidebar-close]').addEventListener('click', function () { document.body.classList.remove('sidebar-open'); });
        root.querySelectorAll('[data-draft-form]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var message = form.querySelector('.draft-message');
                message.textContent = 'Preview only: this form will save to MySQL after the database is connected.';
                message.classList.add('show');
            });
        });
        root.querySelectorAll('[data-table-filter]').forEach(function (input) {
            var table = root.querySelector(input.getAttribute('data-table-filter'));
            input.addEventListener('input', function () {
                var query = input.value.toLowerCase();
                table.querySelectorAll('tbody tr').forEach(function (row) { row.style.display = row.textContent.toLowerCase().indexOf(query) === -1 ? 'none' : ''; });
            });
        });
    }

    if (path === '/logout') {
        localStorage.removeItem('dormis-demo-user');
        window.location.replace('/login');
        return;
    }

    if (path === '/' || path === '/login') {
        if (user && (user.role === 'admin' || user.role === 'boarder')) {
            window.location.replace('/' + user.role + '/dashboard');
            return;
        }
        renderLogin();
        return;
    }

    var sections = path.split('/').filter(Boolean);
    var role = sections[0];
    var key = sections[1] || 'dashboard';
    if (!user) {
        window.location.replace('/login');
        return;
    }
    if (role !== user.role) {
        window.location.replace('/' + user.role + '/dashboard');
        return;
    }
    var allowed = role === 'admin' ? adminPages : boarderPages;
    if (!allowed.some(function (page) { return page[0] === key; })) {
        window.location.replace('/' + role + '/dashboard');
        return;
    }
    renderApp(role, key);
}());
