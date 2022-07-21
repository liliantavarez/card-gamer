/* eslint-disable no-var */
/* eslint-disable no-undef */
/* eslint-disable prefer-const */
const express = require("express");
const bodyParse = require("body-parser");
const multer = require("multer")
const router = express.Router();
const db = require("../database/dataBaseModel");
const path = require('path')
const storage  = multer.diskStorage({
    destination:(req, file, callBack)=>{
        callBack(null, path.resolve('../public/imgs/upload'));
    },
    filename: (req, file, callBack)=>{
        const time = new Date().getTime();
        callBack(null, `${time}_${file.originalname}`)
    }
})
const uploud = multer({storage:storage})
var idUser = "";

router.get("/perfil/:id", (req, res) => {
    res.render("perfil");
});

router.get("/perfil/:id", async (req, res) => {
    idUser = req.params.id;
    res.render("perfil");
});

router.post("/perfil/:id/novacarta", bodyParse.json(), async (req, res) => {
    let carta = req.body;
    db.Cartas.create({
        idUsuario: idUser,
        nome: carta.nome,
        ataque: carta.ataque,
        defesa: carta.defesa,
        magia: carta.magia,
        imagem: carta.imagem,
    })
        .then(() => {
            res.redirect(`/perfil/${idUser}`);
        })
        .catch(err => {
            res.send(err);
        });
        
});

router.get("/perfil/:id/board", async (req, res) => {
    let { id } = req.params;
    console.log(idUser);
    console.log(id);
    let userInfos = await db.PostInfos.findOne({
        where: {
            id: idUser,
        },
    });
    res.json(JSON.stringify(userInfos));
});
router.get("/perfil/:id/cartas", async (req, res) => {
    let { id } = req.params;
    console.log(idUser);
    console.log(id);
    let cartas = await db.Cartas.findAll({
        where: {
            idUsuario: idUser || id,
        },
    });
    res.json(JSON.stringify(cartas));
});

module.exports = router;
