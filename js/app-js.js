const welcomeElement = document.querySelector('.password-generator__welcome');
const datetimeElement = document.querySelector('.password-generator__datetime');

const taskName = document.querySelector('#taskName').value;
const taskDescription = document.querySelector('#taskDescription').value;
const taskDate = document.querySelector('#taskDate').value;
const taskTime = document.querySelector('#taskTime').value;

const btnAdicionar = document.querySelector('#adicionarTarefaBtn');
const btnPendente = document.querySelector('#filtrarPendentesBtn');
const btnConcluidas = document.querySelector('#filtrarConcluidasBtn');
const btnTodas = document.querySelector('#filtrarTodasBtn');
const btnRecente = document.querySelector('#ordenarRecentesBtn');
const btnAntigo = document.querySelector('#ordenarAntigasBtn');
const btnLixeira = document.querySelector('#visualizarLixeiraBtn');


// function SAUDAÇÃO
const getSaudacao = () => {

  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Bom dia';
  if (hora >= 12 && hora < 18) return 'Boa tarde';
  return 'Boa noite'
};

// function DATA E HORA
const formatarDataHora = () => {

  const agora = new Date(); //cria um novo objeto  //objeto com a data e hora atual
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  // obtem e formata os componentes da data
  const dia = agora.getDate().toString().padStart(2, '0'); //dia do mes (01-31)
  const mes = (agora.getMonth() + 1).toString().padStart(2, '0'); //mes (01-12)
  const ano = agora.getFullYear(); // ano com 4 digitos
  const diaSemana = diasSemana[agora.getDay()]; // nome do dia da semana

  // obtem e formata os componentes do horario
  const hora = agora.getHours().toString().padStart(2, '0'); //hora (00-23)
  const minuto = agora.getMinutes().toString().padStart(2, '0'); //minuto (00-59)
  const segundo = agora.getSeconds().toString().padStart(2, '0'); //segundos (00-59)

  return `${diaSemana}`, `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

};

// funcao que utiliza o cabeçalho  com a saudação e a data
const atualizarHeader = () => {

  welcomeElement.textContent = `${getSaudacao()}!`
  datetimeElement.textContent = formatarDataHora();

};

// att header a cada segundo
setInterval(atualizarHeader, 1000);

// inicializar header
atualizarHeader();

//function carregar tarefa
const carregarTarefas = () => {

  const taskList = document.querySelector('#taskList');
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  taskList.innerHTML = '<h2>Suas Tarefas</h2>';

  tarefas.forEach(tarefa => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    if (tarefa.concluida) {
      taskItem.classList.add('concluida');
    };

    taskItem.innerHTML = tarefa.html;
    taskList.appendChild(taskItem);

    // Add event listener aos botões da tarefa
    taskItem.querySelector('.complete-btn').addEventListener('click', function () {
      marcarComoConcluida(this);
    });
    taskItem.querySelector('.edit-btn').addEventListener('click', function () {
      editarTarefa(this);
    });
    taskItem.querySelector('.delete-btn').addEventListener('click', function () {
      excluirTarefa(this);
    });
  });
};

const adicionarTarefa = () => {
  const taskName = document.querySelector('#taskName').value;
  const taskDescription = document.querySelector('#taskDescription').value;
  const taskDate = document.querySelector('#taskDate').value;
  const taskTime = document.querySelector('#taskTime').value;

  // Verificar se todos os campos dos formulários foram preenchidos
  if (taskName && taskDate && taskTime) {
    const taskList = document.querySelector('#taskList');

    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');

    const dataInput = taskDate.split('-');
    console.log(dataInput);

    // Formatando a data no padrão dd/mm/aa
    const dataFormatada = `${dataInput[2]}/${dataInput[1]}/${dataInput[0]}`;
    console.log(dataFormatada);

    // Código HTML que será injetado na DIV
    const taskHTML = `
        <h3>${taskName}</h3>
        <p>${taskDescription}</p>
        <p><strong>Vencimento:</strong> ${dataFormatada} ás ${taskTime}</p>
        <div class="task-actions">
            <button class="complete-btn">Concluir</button>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Excluir</button>
        </div>
      `;

    // Injeção do código HTML com as tarefas do usuário
    taskItem.innerHTML = taskHTML;
    taskList.appendChild(taskItem);

    // Adicionar event Listener aos botões da tarefa
    taskItem.querySelector('.complete-btn').addEventListener('click', function () {
      marcarComoConcluida(this);
    });
    taskItem.querySelector('.edit-btn').addEventListener('click', function () {
      editarTarefa(this);
    });
    taskItem.querySelector('.delete-btn').addEventListener('click', function () {
      excluirTarefa(this);
    });

    // Criar o objeto, converter em string e Salvar no localStorage
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push({
      nome: taskName,
      descricao: taskDescription,
      data: taskDate,
      hora: taskTime,
      html: taskHTML
    });

    // Conversão do objeto para string
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    Swal.fire('Adicionada.', 'Tarefa adicionada!', 'success');
    document.querySelector('#taskForm').reset();
  } else {
    Swal.fire('Eita!', 'Preencha todos os campos obrigatórios!', 'warning');
  };
};

window.onload = function () {
  carregarTarefas();

  // Adicionando event listeners para os botões
  document.querySelector('#adicionarTarefaBtn').addEventListener('click', function (e) {
    e.preventDefault();
    adicionarTarefa();
  });

  // Event listeners para os botões de filtro
  document.querySelector('#filtrarTodasBtn').addEventListener('click', function () {
    filtrarTarefas('todas');
  });

  document.querySelector('#filtrarPendentesBtn').addEventListener('click', function () {
    filtrarTarefas('pendentes');
  });

  document.querySelector('#filtrarConcluidasBtn').addEventListener('click', function () {
    filtrarTarefas('concluidas');
  });

  // Event listeners para os botões de ordenação
  document.querySelector('#ordenarRecentesBtn').addEventListener('click', function () {
    ordenarTarefas('recentes');
  });

  document.querySelector('#ordenarAntigasBtn').addEventListener('click', function () {
    ordenarTarefas('antigas');
  });

  document.querySelector('#visualizarLixeiraBtn').addEventListener('click', function () {
    mostrarTarefasExcluidas();
  });
};

const marcarComoConcluida = (button) => {

  const taskItem = button.closest('.task-item');

  if (taskItem.classList.contains('concluida')) {
    Swal.fire('Concluída.', 'Esta tarefa já foi concluida!', 'success');
    return;
  };

  taskItem.classList.add('concluida');

  const editBtn = taskItem.querySelector('.edit-btn');
  const deleteBtn = taskItem.querySelector('.delete-btn');
  editBtn.disabled = true;
  deleteBtn.disabled = true;

  const taskName = taskItem.querySelector('h3').textContent;
  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const tarefaIndex = tarefas.findIndex(t => t.nome === taskName);

  if (tarefaIndex !== -1) {

    tarefas[tarefaIndex].concluida = true;
    tarefas[tarefaIndex].html = taskItem.innerHTML;

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    setTimeout(() => {
      Swal.fire('Concluída.', 'Tarefa marcada como concluída!', 'success');
    }, 200)

  };

};

// const editarTarefa = (button) => {
  

//   const taskItem = button.closest('.task-item');
//   const novoTitulo = prompt('Como você quer que seja o novo título?', taskItem.querySelector('h3').textContent);
//   const novaDescricao = prompt('Como você quer que seja a nova descrição?', taskItem.querySelector('p').textContent);

//   if (novoTitulo) taskItem.querySelector('h3').textContent = novoTitulo;
//   if (novaDescricao) taskItem.querySelector('p').textContent = novaDescricao;

// };

const editarTarefa = async (button) => {  // Adicionei async aqui
  const taskItem = button.closest('.task-item');
  
  const { value: formValues } = await Swal.fire({
    title: "Editar Tarefa:",
    html: `
      <input id="swal-input1" class="swal2-input" value="${taskItem.querySelector('h3').textContent}">
      <input id="swal-input2" class="swal2-input" value="${taskItem.querySelector('p').textContent}">
    `,
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value
      ];
    }
  });  // Este era o parêntese que faltava fechar

  if (formValues) {
    const [novoTitulo, novaDescricao] = formValues;
    if (novoTitulo) taskItem.querySelector('h3').textContent = novoTitulo;
    if (novaDescricao) taskItem.querySelector('p').textContent = novaDescricao;
    
    // Atualizar no localStorage
    atualizarTarefaNoLocalStorage(taskItem, novoTitulo, novaDescricao);
  }
};

// Função auxiliar para atualizar no localStorage
function atualizarTarefaNoLocalStorage(taskItem, novoTitulo, novaDescricao) {
  const taskName = taskItem.querySelector('h3').textContent;
  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const tarefaIndex = tarefas.findIndex(t => t.nome === taskName);
  
  if (tarefaIndex !== -1) {
    tarefas[tarefaIndex].nome = novoTitulo;
    tarefas[tarefaIndex].descricao = novaDescricao;
    tarefas[tarefaIndex].html = taskItem.innerHTML;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }
}

const excluirTarefa = (button) => {

  Swal.fire({
    title: "Deseja mesmo excluir?",
    text: "Esse item irá para sua lixeira!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Excluir!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deletado!",
        icon: "success"
      });

      const taskItem = button.closest('.task-item');
      const taskName = taskItem.querySelector('h3').textContent;
      const taskDescription = document.querySelector('#taskDescription').value;
      const taskDate = document.querySelector('#taskDate').value;
      const taskTime = document.querySelector('#taskTime').value;

      let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
      tarefas = tarefas.filter(t => t.nome !== taskName);
      localStorage.setItem('tarefas', JSON.stringify(tarefas));

      let tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasExcluidas')) || [];
      tarefasExcluidas = tarefasExcluidas.filter(t => t.nome !== taskName);

      tarefasExcluidas.push({
        nome: taskName,
        descricao: taskDescription,
        data: taskDate,
        hora: taskTime
      });

      localStorage.setItem('tarefasExcluidas', JSON.stringify(tarefasExcluidas));

      taskItem.remove();

    };
  });
};

const mostrarTarefasExcluidas = () => {

    const tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasExcluidas')) || [];

    const tarefasValidas = tarefasExcluidas.filter(tarefa => tarefa && tarefa.nome);

    if (tarefasValidas.length === 0) {

      alert('Não há tarefas na lixeira.')
      return;

    }

    let mensagem = 'Tarefas na lixeira:\n\n';

    tarefasValidas.forEach((tarefa, index) => {

      mensagem += `${index + 1}. ${tarefa.nome}\n`;

    });

    const resposta = prompt(mensagem + '\nDigite o número que deseja restaurar (ou cancele para sair)');

    if (resposta && !isNaN(resposta)) {

      const index = parseInt(resposta) - 1;
      if (index >= 0 && index < tarefasValidas.length) {


        restaurarTarefa(tarefasValidas[index]);

      } else {

        alert('Número inválido!');

      };

    };

  };

const restaurarTarefa = (tarefaExcluida) => {

  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefas.push(tarefaExcluida);
  localStorage.setItem('tarefas', JSON.stringify(tarefas));

  let tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasExcluidas')) || [];
  tarefasExcluidas = tarefasExcluidas.filter(t => t.nome !== tarefaExcluida.nome);
  localStorage.setItem('tarefasExcluidas', JSON.stringify(tarefasExcluidas));

  location.reload();

};


const filtrarTarefas = (filtro) => {

  const tarefas = document.querySelectorAll('.task-item');
  console.log(tarefas);
  tarefas.forEach(tarefa => {
    switch (filtro) {
      case 'todas':
        tarefa.style.display = 'block';
        break;
      case 'pendentes':
        tarefa.style.display = tarefa.classList.contains('concluida') ? 'none' : 'block';
        break;

      case 'concluidas':
        tarefa.style.display = tarefa.classList.contains('concluida') ? 'none' : 'block';
        break;
    };
  });
};

const ordenarTarefas = (ordem) => {

  // obter a lista de tarefas e os dados do localStorage
  const taskList = document.querySelector('#taskList');

  // converter a coleção de tarefas de um array
  const tarefas = Array.from(document.querySelectorAll('.task-item'));

  // obter os dados das tarefas do localStorage
  const dadosTarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  // ordenar as tarefas com base na ordem selecionada
  // o sort() é um metodo que ordena os elementos de um array
  // a função de comparação recebe dois argumentos, a e b, que sao os elementos a serem comparados
  tarefas.sort((a, b) => {

    // obter os nomes das tarefas
    const nomeA = a.querySelector('h3').textContent;
    const nomeB = b.querySelector('h3').textContent;

    // obter as datas das tarefas
    const tarefaA = dadosTarefas.find(t => t.nome === nomeA);
    const tarefaB = dadosTarefas.find(t => t.nome === nomeB);

    // converter as datas para objetos Date e comparar padrão ISO 8601(T)
    const dataA = new Date(`${tarefaA.data}T${tarefaA.hora}`);
    const dataB = new Date(`${tarefaB.data}T${tarefaB.hora}`);

    // ordenar as tarefas com base na ordem selecionada
    return ordem === 'antigas' ? dataB - dataA : dataA - dataB;

  });

  // limpar a lista e add as tarefas ordenadas
  taskList.innerHTML = '<h2>Suas Tarefas</h2>';
  tarefas.forEach(tarefa => taskList.appendChild(tarefa));

};









