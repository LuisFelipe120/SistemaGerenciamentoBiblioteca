import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
const host = '0.0.0.0';
const porta = 3000;
var livros = [];
var leitores = [];
const app = express();

app.use(cookieParser());

app.use(session({
    secret: 'M1nh4Ch4v3S3cr3t4',
    resave: true, 
    saveUninitialized: true, 
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 1000 * 60 * 30
    }
}));


app.use(express.urlencoded({extended: true}));

app.get("/", estaAutenticado,(requisicao,resposta)=>{
  const ultimoAcesso = requisicao.cookies?.ultimoAcesso || "Nunca acessou";
    console.log("Último acesso:", ultimoAcesso);
    resposta.write(`
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                <title>Biblioteca</title>
            </head>
            <body>
             
    `);
    resposta.write(`
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="#">Biblioteca</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="navbar-nav">
                            <li class="nav-item active">
                                <a class="nav-link" href="/livros">Cadastrar livro</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/leitores">Cadastrar leitor</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/logout">Logout</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    opções de listagem
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li><a class="dropdown-item" href="/listarlivros">Listar livros</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div class="w-100 d-flex justify-content-center flex-column align-items-center" style="height: 80vh;">
                <h1>Bem-vindo à sua biblioteca!</h1>
    `);
                resposta.write(`
                <p>${ultimoAcesso}</p>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            </body>
        </html>

    `);

    resposta.end();

})

app.get("/livros", estaAutenticado, (requisicao, resposta) => {
   resposta.write(`
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Cadastro</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body>

    <div class="container mt-5">

    <form method="POST" action="/livros" class="row gy-2 gx-3 align-items-center border p-3">

    <legend><h3>Cadastro de Livros</h3></legend>

    <div class="row">
    <label for="titulo">Titulo do livro</label>
    <input type="text" class="form-control mb-2" id="titulo" name="titulo">
    </div>

    <div class="row">
    <label for="nome">Nome do Autor</label>
    <input type="text" class="form-control mb-2" id="nome" name="nome">
    </div>
    <div class="row">
    <label for="isbn">Codigo ISBN ou indentificação do livro</label>
    <input type="number" class="form-control mb-2" id="isbn" name="isbn">
    </div>
    <div class="row">
    <button type="submit" class="btn btn-primary">Cadastrar Livro</button>
    </div>

    </form>
    </div>

    </body>
    </html>
    `);

    resposta.end();
    });
    app.post("/livros", estaAutenticado, (requisicao, resposta) => {

        const titulo = requisicao.body.titulo;
        const nome = requisicao.body.nome;
        const isbn = requisicao.body.isbn;
        if (!titulo || !nome || !isbn) {
            let html = `
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Cadastro</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body>

    <div class="container mt-5">

    <form method="POST" action="/livros" class="row gy-2 gx-3 align-items-center border p-3">

    <legend><h3>Cadastro de Livros</h3></legend>

    <div class="row">
    <label for="titulo">Titulo do livro</label>
    <input type="text" class="form-control mb-2" id="titulo" name="titulo" value="${titulo || ''}">
    `;
    if(!titulo) {
        html += `<div class="alert alert-danger" role="alert">
                    O campo título é obrigatório!
                </div>`;
    }
    html += `
    </div>    
    <div class="row">
    <label for="nome">Nome do Autor</label>
    <input type="text" class="form-control mb-2" id="nome" name="nome" value="${nome || ''}">
    `;
    if(!nome) {
        html += `<div class="alert alert-danger" role="alert">
                    O campo nome do autor é obrigatório!
                </div>`;
    }
    html += `
   
    </div>
    <div class="row">
    <label for="isbn">Codigo ISBN ou indentificação do livro</label>
    <input type="number" class="form-control mb-2" id="isbn" name="isbn" value="${isbn || ''}">`;
     if(!isbn) {
        html += `<div class="alert alert-danger" role="alert">
                    O campo ISBN é obrigatório!
                </div>`;
    }
    html += `
    </div>
    <div class="row">
    <button type="submit" class="btn btn-primary">Cadastrar Livro</button>
    </div>

    </form>
    </div>

    </body>
    </html>
    `;
            resposta.write(html);
            resposta.end();
        }
        else 
        {
            livros.push({
                titulo:titulo, nome:nome, isbn:isbn});
            resposta.redirect("/listarlivros");

        }
    });

app.get("/listarLivros", estaAutenticado, (requisicao, resposta) => {
      resposta.write(`
    <html lang="pt-br">
    <head>
    <meta charset="UTF-8">
    <title>Lista de Livros</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body>

    <div class="container mt-5">

    <table class="table table-striped table-hover">

    <thead>
    <tr>
    <th>Id</th>
    <th>Titulo</th>
    <th>Autor</th>
    <th>ISBN</th>
    </tr>
    </thead>

    <tbody>
    `);

    for (let i = 0; i < livros.length; i++) {

        const livro = livros[i];

        resposta.write(`
        <tr>
        <td>${i + 1}</td>
        <td>${livro.titulo}</td>
        <td>${livro.nome}</td>
        <td>${livro.isbn}</td>
        </tr>
        `);
    }
    resposta.write(`
    </tbody>
    </table>

    <a href="/livros" class="btn btn-primary">
    Continuar cadastrando
    </a>

    </div>

    </body>
    </html>
    `);

    resposta.end();

});
app.get("/leitores", estaAutenticado, (requisicao, resposta) => {
resposta.write(`
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Cadastro</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body>

    <div class="container mt-5">

    <form method="POST" action="/leitores" class="row gy-2 gx-3 align-items-center border p-3">

    <legend><h3>Cadastro de Leitores</h3></legend>

    <div class="row">
    <label for="nome">Nome do Leitor</label>
    <input type="text" class="form-control mb-2" id="nome" name="nome">
    </div>

    <div class="row">
    <label for="cpf">CPF</label>
    <input type="number" class="form-control mb-2" id="cpf" name="cpf">
    </div>
    
    <div class="row">
    <label for="contato">Telefone para contato</label>
    <input type="number" class="form-control mb-2" id="contato" name="contato">
    </div>
     <div class="row">
    <label for="emprestimo">Data para emprestimo</label>
    <input type="date" class="form-control mb-2" id="emprestimo" name="emprestimo">
    </div>
    <div class="row">
    <label for="devolucao">Data para devolução</label>
    <input type="date" class="form-control mb-2" id="devolucao" name="devolucao">
    </div>
    <div class="row">
     <label for="livros">Livros</label>
         <select class="form-select mb-2" id="livrosName" name="livrosName">
            <option selected>Selecione um livro</option>
`)
    for (let i = 0; i < livros.length; i++) {

        const livro = livros[i];    
        resposta.write(`
        <option value="${livro.id}">${livro.titulo}</option>  
        `);  
    }
    resposta.write(`
    </select>
    </div>

    <div class="row">
    <button type="submit" class="btn btn-primary">Cadastrar Leitor</button>
    </div>

    </form>
    </div>

    </body>
    </html>
    `);
    resposta.end();
});
app.post("/leitores", estaAutenticado, (requisicao, resposta) => {
    const nome = requisicao.body.nome;
    const cpf = requisicao.body.cpf;
    const contato = requisicao.body.contato;
    const emprestimo = requisicao.body.emprestimo;
    const devolucao = requisicao.body.devolucao;
    const livrosName = requisicao.body.livrosName; 

    if (!nome || !cpf || !contato || !emprestimo || !devolucao || !livrosName) 
    {   
        let html = `
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Cadastro</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>

        <body>

        <div class="container mt-5">

        <form method="POST" action="/leitores" class="row gy-2 gx-3 align-items-center border p-3">

        <legend><h3>Cadastro de Leitores</h3></legend>

        <div class="row">
        <label for="nome">Nome do Leitor</label>
        <input type="text" class="form-control mb-2" id="nome" name="nome" value="${nome || ''}">
        `;
            if(!nome) {
            html += `<div class="alert alert-danger" role="alert">
                        O campo nome do leitor é obrigatório!
                    </div>`;
        }
        html += `
        </div>

        <div class="row">
        <label for="cpf">CPF</label>
        <input type="number" class="form-control mb-2" id="cpf" name="cpf" value="${cpf || ''}">
        `;
        if(!cpf) {
            html += `<div class="alert alert-danger" role="alert">
                        O campo CPF é obrigatório!
                    </div>`;
        }
        html += `
        </div>
        
        <div class="row">
        <label for="contato">Telefone para contato</label>
        <input type="number" class="form-control mb-2" id="contato" name="contato" value="${contato || ''}">
        `;
        if(!contato) {
            html += `<div class="alert alert-danger" role="alert">
                        O campo contato é obrigatório!
                    </div>`;
        }
        html += `

        </div>
        <div class="row">
        <label for="emprestimo">Data para emprestimo</label>
        <input type="date" class="form-control mb-2" id="emprestimo" name="emprestimo" value="${emprestimo || ''}">
        `;
        if(!emprestimo) {
            html += `<div class="alert alert-danger" role="alert">
                        O campo data de empréstimo é obrigatório!
                    </div>`;
        }
        html += `
        </div>
        <div class="row">
        <label for="devolucao">Data para devolução</label>
        <input type="date" class="form-control mb-2" id="devolucao" name="devolucao" value="${devolucao || ''}">
        `;
        if('!devolucao') {
            html += `<div class="alert alert-danger" role="alert">
                        O campo data de devolução é obrigatório!
        </div>`;
        }
        html += `
        </div>
        <div class="row">
        <label for="livros">Livros</label>
            <select class="form-select mb-2" id="livrosName" name="livrosName">
    `;
    if(!livrosName) {
        html += `<option value="" selected>Selecione um livro</option>`;
    }
    else
        {
            html += `<option value="" >Selecione um livro</option>`;
        }
        
        for (let i = 0; i < livros.length; i++) {

            const livro = livros[i];    
            if(livro.id == livrosName) {
                html += `<option value="${livro.id}" selected>${livro.titulo}</option>`;  
            }
            else {
                html += `<option value="${livro.id}">${livro.titulo}</option>`;  
            }
         
        }
        html += `
        </select>
        </div>

        <div class="row">
        <button type="submit" class="btn btn-primary">Cadastrar Leitor</button>
        </div>

        </form>
        </div>

        </body>
        </html>
        `;
        resposta.write(html);
        resposta.end();
    }
        else
            {
                leitores.push({
                    nome:nome, cpf:cpf, contato:contato, emprestimo:emprestimo, devolucao:devolucao, livrosName:livrosName
                });
                resposta.redirect("/leitores");
            }
});
  
app.get('/login', (requisicao, resposta) => {
  
    resposta.write(`
        <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Cadastro</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body>
        `)
    resposta.write(`<section class="vh-100 gradient-custom">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">

            <div class="mb-md-5 mt-md-4 pb-5">

              <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
              <p class="text-white-50 mb-5">Preencha seu login e senha!</p>

              <form method="POST" action="/login">
              <div data-mdb-input-init class="form-outline form-white mb-4">
                <input type="email" id="email" name="email" class="form-control form-control-lg" />
                <label class="form-label" for="email">Email</label>
              </div>

              <div data-mdb-input-init class="form-outline form-white mb-4">
                <input type="password" id="senha" name="senha" class="form-control form-control-lg" />
                <label class="form-label" for="senha">Senha</label>
              </div>

              <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">não tem senha?</a></p>

              <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
            `)
    resposta.write(`
        </form>
    
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</body>
</html>
`)
    resposta.end();
})

app.post('/login', (requisicao, resposta) => {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if (email === "biblioteca@hotmail.com" && senha === "admin123") {
        requisicao.session.logado = true; 
        const dataUltimoAcesso = new Date();
        resposta.cookie("ultimoAcesso", dataUltimoAcesso.toLocaleString(), {maxAge: 1000 * 60 * 24 * 30, httpOnly: true});
        resposta.redirect("/");
    } else {
        resposta.write(`
        <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Cadastro</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body>
        `)
        resposta.write(`<section class="vh-100 gradient-custom">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">

            <div class="mb-md-5 mt-md-4 pb-5">

              <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
              <p class="text-white-50 mb-5">Preencha seu login e senha!</p>
            <form method="POST" action="/login">
              <div data-mdb-input-init class="form-outline form-white mb-4">
                <input type="email" id="email" name="email" class="form-control form-control-lg" />
                <label class="form-label" for="email">Email</label>
              </div>

              <div data-mdb-input-init class="form-outline form-white mb-4">
                <input type="password" id="senha" name="senha" class="form-control form-control-lg" />
                <label class="form-label" for="senha">Senha</label>
              </div>

              <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">não tem senha?</a></p>

              <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
            </form>

            </div>
            <span>
                <p class="text-danger">Email ou senha inválidos!</p>
            </span>
        
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</body>
</html>
`)
        resposta.end();
    }
});

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
});



function estaAutenticado(requisicao, resposta, proximo) {
    if (requisicao.session?.logado) {
        proximo();
    }
    else {
        resposta.redirect("/login");
    }
}

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});