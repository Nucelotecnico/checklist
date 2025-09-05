
// document.addEventListener("DOMContentLoaded", function() {
//   const numerons = carregarNumerons();

// });

window.onload = function () {
  const numerons = localStorage.getItem('numerons') || '';
  const numeronsInput = document.getElementById('numerons');
  if (numeronsInput) {
    numeronsInput.value = numerons;
  }
};






function salvarOpcao() {
  const numeronsInput = document.getElementById('numerons');
  if (numeronsInput) {
    const numeronsValue = numeronsInput.value;
    localStorage.setItem('numerons', numeronsValue);
  }


  // Recarrega a página após salvar
  location.reload();

}
    
  
// Event listener para capturar Enter em qualquer lugar da página
document.addEventListener('keydown', function (event) {
    // Verificar se a tecla pressionada é Enter (código 13 ou 'Enter')
    if (event.key === 'Enter' || event.keyCode === 13) {
        // Evitar comportamento padrão (submissão de formulário)
        event.preventDefault();

        // Chamar a função salvar
        salvarOpcao();

        console.log('✅ Salvamento ativado por Enter');
    }
});





//---script para gerar a tela modal  com resumo das notas 

document.getElementById('btnResumo').onclick = function() {
  const tabelas = document.querySelectorAll('.tabela-checklist');
  let tabelaAtual = null;
  tabelas.forEach(tabela => {
    if (tabela.style.display !== 'none') tabelaAtual = tabela;
  });
  if (!tabelaAtual) {
    alert('Nenhuma tabela selecionada.');
    return;
  }
  const numerons = document.getElementById('numerons') ? document.getElementById('numerons').value : '';
  const rows = tabelaAtual.querySelectorAll('tbody tr');
  let resumo = '';
  let count = 0;
  rows.forEach((row, i) => {
    const select = row.querySelector('select');
    const textarea = row.querySelector('textarea');
    if (select.value === 'reprovado' && textarea.value.trim()) {
      count++;
      resumo += `${count}. ${textarea.value.trim()}\n`;
    }
  });
  const titulo = `Itens de inconformidade da NS: ${numerons}\n\n`;
  document.getElementById('resumoTexto').value = titulo + (resumo || 'Nenhuma observação preenchida para itens reprovados.');
  document.getElementById('resumoModal').style.display = 'flex';
};
document.getElementById('fecharResumo').onclick = function() {
  document.getElementById('resumoModal').style.display = 'none';
};


//------------------------novo codigo para logica das tabelas e persistir as informações


const seletor = document.getElementById("seletorChecklist");
const todasTabelas = document.querySelectorAll(".tabela-checklist");

function aplicarCor(row, status) {
  row.classList.remove("aprovado", "analise", "vazio","reprovado");
  if (status === "aprovado") row.classList.add("aprovado");
  else if (status === "analise") row.classList.add("analise");
  else if (status === "reprovado") row.classList.add("reprovado");
  else row.classList.add("vazio");

  console.log('Status:', status, 'Classes:', row.className);
}

function salvarTabela(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const dados = [];
  tabela.querySelectorAll("tbody tr").forEach(row => {
    const td = row.querySelector("td");
    const item = td ? td.textContent : "";
    const select = row.querySelector("select");
    const textarea = row.querySelector("textarea");
    const status = select ? select.value : "";
    const observacao = textarea ? textarea.value : "";
    dados.push({ item, status, observacao });
  });
  localStorage.setItem(`checklist_${tabelaId}`, JSON.stringify(dados));
}

function carregarTabela(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const dados = JSON.parse(localStorage.getItem(`checklist_${tabelaId}`));
  if (!dados) return;

  const rows = tabela.querySelectorAll("tbody tr");
  rows.forEach((row, i) => {
    const select = row.querySelector("select");
    const textarea = row.querySelector("textarea");
    if (dados[i]) {
      select.value = dados[i].status;
      textarea.value = dados[i].observacao;
      aplicarCor(row, dados[i].status);
    }
  });
}

function inicializarEventos(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  tabela.querySelectorAll("tbody tr").forEach(row => {
    const select = row.querySelector("select");
    const textarea = row.querySelector("textarea");

    if (select) {
      select.addEventListener("change", () => {
        aplicarCor(row, select.value);
        salvarTabela(tabelaId);
      });
    }

    if (textarea) {
      textarea.addEventListener("input", () => {
        salvarTabela(tabelaId);
      });
    }
  });
}
function mostrarTabelaSelecionada() {
  todasTabelas.forEach(t => t.style.display = "none");
  const tabelaId = seletor.value;
  if (!tabelaId) return;
  const tabela = document.getElementById(tabelaId);
  tabela.style.display = "block";
  carregarTabela(tabelaId);
  inicializarEventos(tabelaId);
}

function limparTabelaAtual() {
  const tabelaId = seletor.value;
  const tabela = document.getElementById(tabelaId);
  tabela.querySelectorAll("tbody tr").forEach(row => {
    const select = row.querySelector("select");
    const textarea = row.querySelector("textarea");
    select.value = "";
    textarea.value = "";
    aplicarCor(row, "");
  });
  salvarTabela(tabelaId);

  // Limpa numerons do localStorage
  localStorage.removeItem('numerons');
  const numeronsInput = document.getElementById('numerons');
  if (numeronsInput) {
    numeronsInput.value = '';
  }
}

const botaoLimpar = document.createElement("button");
botaoLimpar.textContent = "🧹 Limpar Tabela Atual";
botaoLimpar.style.margin = "20px";
botaoLimpar.style.padding = "10px 24px";
botaoLimpar.style.backgroundColor = "#046609ff";
botaoLimpar.style.color = "#fff";
botaoLimpar.style.border = "none";
botaoLimpar.style.borderRadius = "6px";
botaoLimpar.style.cursor = "pointer";
botaoLimpar.style.fontSize = "16px";
botaoLimpar.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
botaoLimpar.onmouseover = function() {
  botaoLimpar.style.backgroundColor = "#046609ff";
};
botaoLimpar.onmouseout = function() {
  botaoLimpar.style.backgroundColor = "#046609ff";
};
botaoLimpar.onclick = limparTabelaAtual;
document.body.insertBefore(botaoLimpar, document.getElementById("tabelas-checklist-container"));

// Inicializa
seletor.addEventListener("change", mostrarTabelaSelecionada);
mostrarTabelaSelecionada();







