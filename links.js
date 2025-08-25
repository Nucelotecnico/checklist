// 🔐 Substitua com os dados do seu projeto Supabase
const supabaseUrl = 'https://nelzhukmxrgdoarsxcek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbHpodWtteHJnZG9hcnN4Y2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDIxNzUsImV4cCI6MjA3MTU3ODE3NX0.KHvfJHVimKwiraEzbyZWyLnTO5P5VEvM86GlyE7y09k';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 🔄 Carrega os links da tabela
async function loadLinks() {
    const { data, error } = await supabaseClient.from('links').select('*');
    const table = document.getElementById('linkTable');
    table.innerHTML = '';

    if (error) {
        console.error('Erro ao carregar links:', error.message);
        return;
    }

    data.forEach(link => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${link.title}</td>
        <td><a href="${link.url}" target="_blank">${link.url}</a></td>
        <td><button class="excluir" onclick="deleteLink('${link.id}')">Excluir</button></td>
        `;
        table.appendChild(row);
    });
}

// ➕ Adiciona um novo link
async function addLink() {
    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();

    if (!title || !url) {
        alert('Preencha os campos de título e URL!');
        return;
    }

    const { error } = await supabaseClient.from('links').insert([{ title, url }]);

    if (error) {
        alert('Erro ao adicionar link: ' + error.message);
        return;
    }

    document.getElementById('title').value = '';
    document.getElementById('url').value = '';
    loadLinks();
}

// ❌ Exclui um link pelo ID
async function deleteLink(id) {
    const { error } = await supabaseClient.from('links').delete().eq('id', id);

    if (error) {
        alert('Erro ao excluir link: ' + error.message);
        return;
    }

    loadLinks();
}

// 🚀 Inicializa a tabela ao carregar a página
loadLinks();