const supabaseClient = supabase.createClient(
    'https://nelzhukmxrgdoarsxcek.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbHpodWtteHJnZG9hcnN4Y2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDIxNzUsImV4cCI6MjA3MTU3ODE3NX0.KHvfJHVimKwiraEzbyZWyLnTO5P5VEvM86GlyE7y09k'
);

let users = [];

async function loadUsersAndRenderList() {
    const { data, error } = await supabaseClient.from('users').select('*');
    if (error) {
        console.error('Erro ao carregar usuários:', error);
        return;
    }
    users = data;

    const userSelect = document.getElementById('user');
    userSelect.innerHTML = '';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
    });

    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span style="color:${user.color}; font-weight:bold;">${user.name}</span>
          <button data-id="${user.id}">Excluir</button>
        `;
        userList.appendChild(li);
    });

    document.querySelectorAll('#user-list button').forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-id');
            if (confirm('Deseja excluir este usuário?')) {
                await supabaseClient.from('users').delete().eq('id', userId);
                await loadUsersAndRenderList();
            }
        });
    });
}

document.getElementById('user-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const color = document.getElementById('user-color').value;

    if (name && color) {
        await supabaseClient.from('users').insert([{ name, color }]);
        document.getElementById('user-form').reset();
        await loadUsersAndRenderList();
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    await loadUsersAndRenderList();

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        editable: true,
        selectable: true,

        eventClick: async function (info) {
            if (confirm('Deseja excluir este evento?')) {
                await supabaseClient.from('events').delete().eq('id', info.event.id);
                calendar.refetchEvents();
            }
        },

        events: async function (fetchInfo, successCallback, failureCallback) {
            const { data, error } = await supabaseClient
                .from('events')
                .select('id, title, start_date, end_date, users(name, color)');

            if (error) {
                console.error('Erro ao buscar eventos:', error);
                return failureCallback(error);
            }

            const events = data.map(ev => ({
                id: ev.id,
                title: `${ev.title} - ${ev.users?.name || 'Usuário'}`,
                start: ev.start_date,
                end: ev.end_date,
                backgroundColor: ev.users?.color || '#999'
            }));

            successCallback(events);
        }
    });

    calendar.render();
    await renderFutureEventsReport();

    supabaseClient
        .channel('events')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
            calendar.refetchEvents();
        })
        .subscribe();

    const form = document.getElementById('event-form');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const type = document.getElementById('type').value;
        const user_id = document.getElementById('user').value;
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;

        if (title && type && user_id && start && end) {
            const adjustedEnd = new Date(end);
            adjustedEnd.setDate(adjustedEnd.getDate() + 1);

            await supabaseClient.from('events').insert([{
                title,
                type,
                user_id,
                start_date: start,
                end_date: adjustedEnd.toISOString().split('T')[0]
            }]);
            form.reset();
            calendar.refetchEvents();
            await renderFutureEventsReport();

        }
    });


    function formatDateBR(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    async function renderFutureEventsReport() {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabaseClient
            .from('events')
            .select('title, type, start_date, end_date, users(name, color)')
            .gte('end_date', today);

        if (error) {
            console.error('Erro ao buscar eventos futuros e vigentes:', error);
            return;
        }

        // Ordena os eventos pelo start_date (data de início)
        data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

        const list = document.getElementById('future-events-list');
        list.innerHTML = '';

        if (data.length === 0) {
            list.innerHTML = '<li>Nenhum evento futuro ou vigente encontrado.</li>';
            return;
        }

        function formatDateOnly(dateStr) {
            // Remove time if present and format as dd/mm/yyyy
            const [year, month, day] = dateStr.split('T')[0].split('-');
            return `${day}/${month}/${year}`;
        }

        function getAdjustedEndDate(dateStr) {
            // Subtract one day from end_date for display
            const date = new Date(dateStr);
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        }

        data.forEach(ev => {
            const li = document.createElement('li');
            li.innerHTML = `
        <strong style="color:${ev.users?.color || '#333'}">${ev.title}</strong>
        (${ev.type}) - ${ev.users?.name || 'Usuário'}<br>
        De ${formatDateOnly(ev.start_date)} até ${getAdjustedEndDate(ev.end_date)}
    `;
            list.appendChild(li);
        });
    }
});


document.getElementById('toggle-users-btn').addEventListener('click', function () {
    const userDiv = document.getElementById('user-manager');
    userDiv.style.display = userDiv.style.display === 'none' ? 'block' : 'none';
});