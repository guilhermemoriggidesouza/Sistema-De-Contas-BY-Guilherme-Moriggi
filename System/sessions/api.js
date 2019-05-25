var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'contas'
})

module.exports = function(app){
    function QueryExecuta(sql, req, res){
        connection.query(sql, function(error, results, fields){
            if(error){
                res.status(404).send(error);
            }else{
                res.status(200).send(results);
            }
        })
      }
    function updatePoupanca(sqlUm, sqlDois, dados, req, res){
        connection.query('SELECT * FROM salario WHERE idsalario = '+dados+' LIMIT 1', function(error, results, fields){
            if(error){
                res.status(404).send(error);
                console.log(error);
            }else{
                connection.query(sqlDois, function(error, results, fields){
                    if(error){
                        res.status(404).send(error);
                        console.log(error);
                    }else{
                        QueryExecuta(sqlUm, req, res);
                    }
                })
            }
        })
    }
    app.post('/validarLogin', function(req,res){
        var dados = req.body;
        //res.send('ahue');
        //connection.connect();
        //console.log(dados);
        connection.query('SELECT * FROM login WHERE login = "'+dados.login+'"', function (error, results, fields) {
            if(error){
                res.status(404).send(error);
                console.log(error);
            }else{
                if(results.length == 0){
                    res.status(404).send('Senha ou Login não foram encontrados');
                }else{
                    if(results[0].login == dados.login){
                        if(results[0].senha == dados.senha){
                            req.session.user = dados.login;
                            res.status(200).send('go');
                        }else{
                            res.status(404).send('sua Senha não foi encontrada');
                        }
                    }else{
                        res.status(404).send('seu login não foi encontrada');
                    }
                }
            }
        });
        //connection.end();
    })
    app.get('/carregarDados', function(req, res){
        var dados = req.query;
        QueryExecuta(dados.sql, req, res);
    })
    app.post('/inserirDados', function(req, res){
        //res.header('Content-type','application/json');
        var dados = req.body;
        console.log(dados);
        QueryExecuta(dados.sql, req, res);
    })
    app.post('/sessionSalario', function(req,res){
        var dados = req.body
        let sql = 'SELECT * FROM salario WHERE idsalario ='+dados.id;
        connection.query(sql, function(error, results, fields){
            if(error){
                res.status(404).send(error);
            }else{
                req.session.salario ={
                    idsalario: results[0].idsalario,
                    mes: results[0].mes,
                    valorFixo: results[0].valorFixo,
                    valorResto: results[0].valorResto,
                };
                res.send('sessão configurada no salario do Mês: '+results[0].mes);
            }
        })
    })
    app.get('/adicionarSalario', function(req, res){
        var dados = req.query;
        //vai inserir
        connection.query(dados.sql, function(error1, results, fields){
            if(error1){
                console.log(error1);
                res.status(404).send(error1);
            }else{
                //vai selecionar o id doque inseriu
                let sql = 'SELECT * FROM salario ORDER BY idsalario DESC LIMIT 1';
                connection.query(sql, function(error2, selectResults, fields){
                    if(error2){
                        console.log(error2);
                        res.status(404).send(error2);
                    }else{
                        //vai adicionar a poupanca
                        let secondSQL = 'INSERT INTO poupanca VALUES (null, 0,'+selectResults[0].idsalario+')';
                        connection.query(secondSQL, function(error3, insertResults, fields){
                            if(error3){
                                console.log(error3);
                                res.status(404).send(error3);
                            }else{
                                res.status(200)
                                .send({
                                    results : results,
                                    selectResults: selectResults,
                                    insertResults : insertResults
                                });
                            }
                        })
                    }
                })
            }
        })        
    })
    app.delete('/deletarDados', function(req,res){
        res.header('Content-type','application/json');
        var dados = req.body;
        if(dados.tipo == 'salario'){
            connection.query(dados.sql, function(error, results, fields){
                if(error){
                    console.log(error);
                }else{
                    QueryExecuta(dados.secondSql, req, res);
                }
            })
        }
        if(dados.tipo == 'metas'){
            QueryExecuta(dados.sql, req, res);
        }
    });
    app.put('/updateDados/:id', function(req, res){
        res.header('Content-type','application/json');
        var dados = req.params.id;
        var dadosBody = req.body;
        console.log(dadosBody);
        //res.status(404).send("deu ruim");
        if(dadosBody.tipo == 'salario'){
            console.log(dadosBody);
            QueryExecuta(dadosBody.sql, req, res);
        }
        if(dadosBody.tipo == 'poupanca'){
            connection.query('SELECT * FROM salario WHERE idsalario = '+dados+' LIMIT 1', function(error, results, fields){
                if(error){
                    res.status(404).send(error);
                    console.log(error);
                }else{
                    if(dadosBody.acao == 'somar'){
                        if(results[0].valorResto >= dadosBody.valor){
                            updatePoupanca(dadosBody.sql, dadosBody.secondSql, dados, req, res);
                        }else{
                            res.status(200).send('Você inseriu um valor muito alto');
                        }
                    }else{
                        updatePoupanca(dadosBody.sql, dadosBody.secondSql, dados, req, res);
                    }
                }
            })
        }
        if(dadosBody.tipo == 'metas'){
            connection.query('SELECT * FROM poupanca ORDER BY idpoupanca ASC', function(error, results, fields){
                if(error){
                    res.status(404).send(error);
                    console.log(error);
                }else{
                    let conta = [-1*dadosBody.valor];
                    let index;
                    for(i=0;i < results.length; i++){
                        if(Math.sign(conta[i]) === 1){
                            //conta.push(parseInt(results[i].valor+conta[i]));
                            break;
                        }
                        conta.push(parseInt(results[i].valor+conta[i]));              
                    }
                    index = conta.length-2;
                    connection.query('UPDATE poupanca SET valor = '+conta[conta.length-1]+' WHERE idpoupanca = '+results[index].idpoupanca+' LIMIT 1', function(error2, results2, fields){
                        if(error2){
                            res.status(404).send(error2);
                            console.log(error2);
                        }else{
                            connection.query('UPDATE poupanca SET valor = 0 WHERE idpoupanca < '+results[index].idpoupanca, function(error3, results3, fields){
                                if(error3){
                                    res.status(404).send(error3);
                                    console.log(error3);
                                }else{
                                    console.log(results3);
                                    QueryExecuta(dadosBody.sql, req, res);
                                }
                            })
                        };
                    })
                }
            })
        }
        if(dadosBody.tipo == 'objetivo'){
            connection.query('UPDATE salario SET valorResto = '+dadosBody.valor+' WHERE idsalario ='+dadosBody.idsalario, function(error, results, fields){
                if(error){
                    res.status(404).send(error);
                    console.log(error);
                }else{
                    QueryExecuta(dadosBody.sql, req, res);
                }
            })
        }       
    })
    app.get('/destruirSession', function(req, res){
        if(req.session.destroy()){
            res.status(200).send('Sessão foi destruida');
        }else{
            res.status(404).send('Não foi possível destruir a sessão');
        }
    })
}