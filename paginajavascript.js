// Array de Objetos com o catálogo da loja Retalho
const produtos = [
    {
      id: 1,
      nome: "Jaqueta Patchwork Denim",
      categoria: "casacos",
      categoriaLabel: "Casacos & Jaquetas",
      preco: 189.90,
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=600&q=80",
      alt: "Jaqueta jeans feita com retalhos de diferentes lavagens"
    },
    {
      id: 2,
      nome: "Camisa Linho Terracota",
      categoria: "camisas",
      categoriaLabel: "Camisas & Tops",
      preco: 119.90,
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
      alt: "Camisa de linho em tom terroso com botões de madeira"
    },
    {
      id: 3,
      nome: "Calça Cargo Reaproveitada",
      categoria: "calcas",
      categoriaLabel: "Calças & Saias",
      preco: 149.90,
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
      alt: "Calça cargo bege confeccionada com sarja reciclada"
    },
    {
      id: 4,
      nome: "Sobretudo Retalhos de Lã",
      categoria: "casacos",
      categoriaLabel: "Casacos & Jaquetas",
      preco: 229.90,
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80",
      alt: "Casaco longo artesanal em tons neutros"
    },
    {
      id: 5,
      nome: "Top Cropped Algodão Cru",
      categoria: "camisas",
      categoriaLabel: "Camisas & Tops",
      preco: 79.90,
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
      alt: "Blusa leve feita com algodão orgânico cru"
    },
    {
      id: 6,
      nome: "Saia Midi Assimétrica",
      categoria: "calcas",
      categoriaLabel: "Calças & Saias",
      preco: 129.90,
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
      alt: "Saia midi confeccionada com recortes de tecidos leves"
    }
  ];
  
  // Recupera a sacola salva no navegador (localStorage) para funcionar entre páginas
  let sacola = JSON.parse(localStorage.getItem("sacolaRetalho")) || [];
  
  function salvarSacola() {
    localStorage.setItem("sacolaRetalho", JSON.stringify(sacola));
    atualizarInterfaceSacola();
  }
  
  function formatarMoeda(valor) {
    return valor.toFixed(2).replace(".", ",");
  }
  
  // =========================================================
  // RENDERIZAÇÃO DOS CARDS DE PRODUTOS
  // =========================================================
  function criarCardProduto(produto) {
    // Ajusta o caminho do link de detalhes dependendo se estamos na raiz ou em /paginas/
    const naPastaPaginas = window.location.pathname.includes("/paginas/");
    const linkDetalhes = naPastaPaginas ? "produto.html" : "paginas/produto.html";
  
    return `
      <article class="card-produto">
        <img src="${produto.imagem}" alt="${produto.alt}">
        <div class="corpo-card-produto">
          <span class="categoria-tag">${produto.categoriaLabel}</span>
          <h3>${produto.nome}</h3>
          <p class="preco-produto">R$ ${formatarMoeda(produto.preco)}</p>
          <div class="acoes-card">
            <button type="button" class="btn-primario" onclick="adicionarNaSacola(${produto.id})">
              + Sacola
            </button>
            <a href="${linkDetalhes}" class="btn btn-outline-secondary btn-sm d-flex align-items-center">
              Detalhes
            </a>
          </div>
        </div>
      </article>
    `;
  }
  
  // Renderiza destaques na Página Inicial
  function renderizarDestaques() {
    const containerDestaques = document.getElementById("vitrine-destaques");
    if (!containerDestaques) return;
  
    const itensDestaque = produtos.filter((p) => p.destaque);
    containerDestaques.innerHTML = itensDestaque.map(criarCardProduto).join("");
  }
  
  // Renderiza e filtra itens no Catálogo
  function configurarCatalogo() {
    const containerCatalogo = document.getElementById("vitrine-catalogo");
    if (!containerCatalogo) return;
  
    const inputBusca = document.getElementById("busca-produto");
    const botoesCategoria = document.querySelectorAll(".btn-filtro");
    const textoResultados = document.getElementById("contagem-resultados");
  
    let categoriaAtual = "todos";
    let termoBusca = "";
  
    function atualizarLista() {
      const filtrados = produtos.filter((produto) => {
        const bateCategoria = categoriaAtual === "todos" || produto.categoria === categoriaAtual;
        const bateBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase());
        return bateCategoria && bateBusca;
      });
  
      textoResultados.textContent = `Exibindo ${filtrados.length} peça(s)`;
  
      if (filtrados.length === 0) {
        containerCatalogo.innerHTML = `<p class="text-muted">Nenhuma peça encontrada com esse filtro.</p>`;
        return;
      }
  
      containerCatalogo.innerHTML = filtrados.map(criarCardProduto).join("");
    }
  
    botoesCategoria.forEach((botao) => {
      botao.addEventListener("click", () => {
        botoesCategoria.forEach((b) => b.classList.remove("ativo"));
        botao.classList.add("ativo");
        categoriaAtual = botao.dataset.categoria;
        atualizarLista();
      });
    });
  
    if (inputBusca) {
      inputBusca.addEventListener("input", (evento) => {
        termoBusca = evento.target.value;
        atualizarLista();
      });
    }
  
    atualizarLista();
  }
  
  // =========================================================
  // LÓGICA DA SACOLA DEMONSTRATIVA (DOM + EVENTOS)
  // =========================================================
  function adicionarNaSacola(idProduto) {
    const produto = produtos.find((p) => p.id === idProduto);
    if (!produto) return;
  
    sacola.push(produto);
    salvarSacola();
  
    // Abre o modal da sacola para feedback imediato
    const modalElemento = document.getElementById("modalSacola");
    if (modalElemento) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);
      modal.show();
    }
  }
  
  function removerDaSacola(indice) {
    sacola.splice(indice, 1);
    salvarSacola();
  }
  
  function atualizarInterfaceSacola() {
    const contador = document.getElementById("contador-sacola");
    const listaItens = document.getElementById("lista-itens-sacola");
    const totalElemento = document.getElementById("total-sacola");
  
    if (contador) contador.textContent = sacola.length;
    if (!listaItens || !totalElemento) return;
  
    if (sacola.length === 0) {
      listaItens.innerHTML = `<p class="text-muted mb-0">Sua sacola está vazia no momento.</p>`;
      totalElemento.textContent = "0,00";
      return;
    }
  
    let soma = 0;
    listaItens.innerHTML = `
      <ul class="list-group">
        ${sacola
          .map((item, index) => {
            soma += item.preco;
            return `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>${item.nome}</strong><br>
                  <small class="text-muted">R$ ${formatarMoeda(item.preco)}</small>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerDaSacola(${index})" aria-label="Remover ${item.nome}">
                  Remover
                </button>
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  
    totalElemento.textContent = formatarMoeda(soma);
  }
  
  // =========================================================
  // VALIDAÇÃO E INTERAÇÃO DO FORMULÁRIO DE ENCOMENDA
  // =========================================================
  function configurarFormulario() {
    const form = document.getElementById("form-encomenda");
    const alerta = document.getElementById("alerta-formulario");
    if (!form || !alerta) return;
  
    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
  
      const nomeCliente = document.getElementById("nome").value.trim();
      const servico = document.getElementById("tipo-servico");
      const textoServico = servico.options[servico.selectedIndex].text;
  
      alerta.textContent = `Obrigado, ${nomeCliente}! Recebemos sua solicitação de "${textoServico}". Nossa equipe entrará em contato pelo WhatsApp informado.`;
      alerta.classList.remove("d-none");
      alerta.scrollIntoView({ behavior: "smooth" });
  
      form.reset();
    });
  }
  
  // Inicialização quando o DOM estiver carregado
  document.addEventListener("DOMContentLoaded", () => {
    renderizarDestaques();
    configurarCatalogo();
    atualizarInterfaceSacola();
    configurarFormulario();
  
    const btnLimpar = document.getElementById("btn-limpar-sacola");
    if (btnLimpar) {
      btnLimpar.addEventListener("click", () => {
        sacola = [];
        salvarSacola();
      });
    }
  
    const btnFinalizar = document.getElementById("btn-finalizar-compra");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", () => {
        if (sacola.length === 0) {
          alert("Adicione pelo menos uma peça à sacola antes de finalizar!");
          return;
        }
        alert("Pedido demonstrativo registrado com sucesso! Obrigado por apoiar a moda sustentável.");
        sacola = [];
        salvarSacola();
      });
    }
  });