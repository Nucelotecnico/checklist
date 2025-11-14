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

    //const projetos = filtro === '*' ? data : data.filter(item => item.name.includes(filtro));


// ...existing code...
    const projetos = filtro === '*' ? data : data.filter(item => item.name.includes(filtro));

    // função que remove sufixo numérico (timestamp) e extensao para ordenar pelo nome "limpo"
    const cleanName = (name) =>
      name
        .replace(/(?:[_-]\d{6,})(?=\.[^.]+$)/g, '') // remove sufixos numéricos (timestamps)
        .replace(/\.[^.]+$/, '')                   // remove extensão (.pdf)
        .toLowerCase()
        .trim();

    // collator para ordenar corretamente em português (case-insensitive)
    const collator = new Intl.Collator('pt', { sensitivity: 'base', numeric: false });

    projetos.sort((a, b) => collator.compare(cleanName(a.name), cleanName(b.name)));
    
// ...existing code...




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

    // remove sufixo _123456... antes da extensão e melhora leitura substituindo _ por espaço
    const displayName = item.name
      .replace(/(?:[_-]\d{13})(?=\.[^.]+$)/, '')   // remove timestamp de 13 dígitos
      .replace(/\s+/g, '_')                       // converte espaços em underscore
      .replace(/__+/g, '_')                       // colapsa underscores duplicados
      .trim();

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${displayName}</td>
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

// ...existing code...
document.getElementById('formProjeto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nomeRaw = document.getElementById('nomeProjeto').value.trim();
    const arquivo = document.getElementById('arquivoPDF').files[0];
    if (!nomeRaw || !arquivo) {
        alert('Preencha todos os campos.');
        return;
    }

const nomeSanitizado = nomeRaw
    .replace(/[^a-zA-Z0-9À-ÿ\s_-]/g, '') // permite letras, números, espaços, underscore e hífen
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

    const filename = `${nomeSanitizado}.pdf`;
    const caminho = `projetos/${filename}`;

    // DEBUG: logar nomes e objeto file
    console.log('nomeRaw:', nomeRaw);
    console.log('nomeSanitizado:', nomeSanitizado);
    console.log('filename pretendido:', filename);
    console.log('caminho pretendido:', caminho);
    console.log('arquivo.name (nome do arquivo no disco):', arquivo.name);

    // upload com upsert para forçar substituição
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('Projetos_modulos_blindados')
        .upload(caminho, arquivo, { upsert: true });

    if (uploadError) {
        alert('Erro ao enviar o PDF');
        console.error('uploadError', uploadError);
        return;
    }

    // DEBUG: ver retorno do Supabase
    console.log('uploadData:', uploadData);

    alert('Projeto cadastrado com sucesso!');
    document.getElementById('formProjeto').reset();
    listarProjetos();
});
// ...existing code...

document.getElementById('btnBuscar').addEventListener('click', () => {
    const nomeBusca = document.getElementById('buscaProjeto').value.trim().replace(/\s+/g, '_');
    listarProjetos(nomeBusca || '*');
});