module.exports = function(app){
    app.get('/', function(req,res){
        res.render('./index');
    })
    app.get('/paginaPrincipal', function(req,res){
        if(req.session.user){
            let dados = {};
            if(req.session.salario){ 
                console.log('sessao salario ok');
                dados = {
                    idsalario : req.session.salario.idsalario,
                    mes : req.session.salario.mes,
                    valorFixo : req.session.salario.valorFixo,
                    valorResto : req.session.salario.valorResto,
                }
            }
            res.render('./pagPrincipal', {dados: dados});

        }else{
            res.redirect('/');
        }
    })
    app.get('/salarios', function(req, res){
        if(req.session.user){
            let dados = [];
            if(req.session.salario){ 
                //console.log(req.session.salario);
                dados = {
                    idsalario : req.session.salario.idsalario,
                    mes : req.session.salario.mes,
                    valorFixo : req.session.salario.valorFixo,
                    valorResto : req.session.salario.valorResto,
                }
            }
            res.render('./salario', {dados:dados});
        }else{
            res.redirect('/');
        }
    })
    app.get('/metas', function(req, res){
        if(req.session.user){
            //console.log(req.session.user);
            res.render('./metas');
        }else{
            res.redirect('/');
        }
    })
    app.get('/objetivos', function(req,res){
        if(req.session.user){
            let dados = [];
            if(req.session.salario){ 
                //console.log(req.session.salario);
                dados = {
                    idsalario : req.session.salario.idsalario,
                    mes : req.session.salario.mes,
                    valorFixo : req.session.salario.valorFixo,
                    valorResto : req.session.salario.valorResto,
                }
            }
            res.render('./objetivos', {dados:dados}); 
        }else{
            res.redirect('/');
        }
    })
    app.get('/cadastrarObjetivos', function(req,res){
        if(req.session.user){
            let dados = [];
            if(req.session.salario){ 
                //console.log(req.session.salario);
                dados = {
                    idsalario : req.session.salario.idsalario,
                    mes : req.session.salario.mes,
                    valorFixo : req.session.salario.valorFixo,
                    valorResto : req.session.salario.valorResto,
                }
                res.render('./cadastrarObjetivos', {dados:dados});
            }else{
                res.redirect('/');
            }
        }else{
            res.redirect('/');
        }
    })
    app.get('/cadastrarMetas', function(req,res){
        if(req.session.user){
            console.log(req.session.user);
            res.render('./cadastrarMetas'); 
        }else{
            res.redirect('/');
        }
    })
    app.get('/poupanca', function(req,res){
        if(req.session.user){
            let dados = [];
            if(req.session.salario){ 
                //console.log(req.session.salario);
                dados = {
                    idsalario : req.session.salario.idsalario,
                    mes : req.session.salario.mes,
                    valorFixo : req.session.salario.valorFixo,
                    valorResto : req.session.salario.valorResto,
                }
            }
            res.render('./poupanca', {dados:dados});
        }else{
            res.redirect('/');
        }
    })
}