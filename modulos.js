import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
    'https://nelzhukmxrgdoarsxcek.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbHpodWtteHJnZG9hcnN4Y2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDIxNzUsImV4cCI6MjA3MTU3ODE3NX0.KHvfJHVimKwiraEzbyZWyLnTO5P5VEvM86GlyE7y09k'
);

async function listarProjetos(filtro = '*') {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';

    const { data, error } = await supabase.storage
        .from('Projetos_modulos_blindados')
        .list('projetos', { limit: 100 });

    if (error) {
        resultado.innerHTML = `<p>Erro ao buscar arquivos.</p>`;
        console.error(error);
        return;
    }

    const projetos = filtro === '*' ? data : data.filter(item => item.name.includes(filtro));

    if (!projetos || projetos.length === 0) {
        resultado.innerHTML = `<p>Nenhum projeto encontrado.</p>`;
        return;
    }

    resultado.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Nome do Projeto</th>
              <th>Link para PDF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="tabelaProjetos"></tbody>
        </table>
      `;

    const corpoTabela = document.getElementById('tabelaProjetos');

    for (const item of projetos) {
        const caminho = `projetos/${item.name}`;
        const { data: urlData } = supabase.storage
            .from('Projetos_modulos_blindados')
            .getPublicUrl(caminho);

        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${item.name}</td>
          <td><a href="${urlData.publicUrl}" target="_blank">Visualizar PDF</a></td>
          <td><button class="excluir" onclick="excluirProjeto('${caminho}')">Excluir</button></td>
        `;
        corpoTabela.appendChild(linha);
    }
}

window.excluirProjeto = async function (caminho) {
    console.log('Tentando excluir:', caminho); // 👈 log útil

    const confirmar = confirm('Tem certeza que deseja excluir este projeto?');
    if (!confirmar) return;

    const { error } = await supabase.storage
        .from('Projetos_modulos_blindados')
        .remove([caminho]);

    if (error) {
        alert('Erro ao excluir o projeto.');
        console.error(error);
        return;
    }

    alert('Projeto excluído com sucesso!');
    listarProjetos();
};


window.addEventListener('DOMContentLoaded', () => listarProjetos());

document.getElementById('formProjeto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeProjeto').value.trim();
    const arquivo = document.getElementById('arquivoPDF').files[0];

    if (!nome || !arquivo) {
        alert('Preencha todos os campos.');
        return;
    }

    const nomeArquivo = `projetos/${nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

    const { error } = await supabase.storage
        .from('Projetos_modulos_blindados')
        .upload(nomeArquivo, arquivo);

    if (error) {
        alert('Erro ao enviar o PDF');
        console.error(error);
        return;
    }

    alert('Projeto cadastrado com sucesso!');
    document.getElementById('formProjeto').reset();
    listarProjetos();
});

document.getElementById('btnBuscar').addEventListener('click', () => {
    const nomeBusca = document.getElementById('buscaProjeto').value.trim().replace(/\s+/g, '_');
    listarProjetos(nomeBusca || '*');
});