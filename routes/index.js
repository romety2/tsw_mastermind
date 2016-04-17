/*jshint node: true, esnext: true */
// poniżej użylismy krótszej (niż na wykładzie) formy
// module.exports ==> exports
exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    req.session.gra = { "biale" : 0, "czarne" : 0, "ruchy" : 0};
    var newGame = function () {
        var i, data = [],
            puzzle = req.session.puzzle;
        
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }
        req.session.puzzle.data = data;
        return {
            "retMsg": "Gra"
        };
    };
    // poniższa linijka jest zbędna (przy założeniu, że
    // play zawsze używany będzie po index) – w końcowym
    // rozwiązaniu można ją usunąć.
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    /*
     * req.params[2] === wartość size
     * req.params[4] === wartość dim
     * req.params[6] === wartość max
     */
    if (req.params[2]) {
        req.session.puzzle.size = req.params[2];
    }
    if (req.params[4]) {
        req.session.puzzle.dim = req.params[4];
    }
    if (req.params[6]) {
        req.session.puzzle.max = req.params[6];
    }
    res.json(newGame());
};

exports.mark = function (req, res) {
    
        var markAnswer = function () {

            var wynik = (tbS, tbG) => {
                var _ = require("underscore");
                var ileS = _.countBy(tbS, (num) => num);
                var ileG = _.countBy(tbG, (num) => num);
                var czarne = _.size(_.filter(_.zip(tbS, tbG), (a) => (a[0] === Number(a[1]))));
                var biale = _.reduce(_.mapObject(_.pick(ileS, _.keys(ileG)), (val, key) => (val <= ileG[key] ? val : ileG[key])), (memo, num) => memo + num, 0) - czarne;
                return _.object(['czarne', 'biale'], [czarne, biale]);
            };
            var move = req.params[0].split('/');
            var pkt;
            var kom = '';
            var wygrana = false;
            var przegrana = false;
            req.session.gra.ruchy++;
            move = move.slice(0, move.length - 1);
            pkt = wynik(req.session.puzzle.data, move);
            if(pkt.czarne === Number(req.session.puzzle.size))
            {
                kom = "GRATULACJE! Wygrałeś :>";
                wygrana = true;
            }
            else if(Number(req.session.gra.ruchy) >= Number(req.session.puzzle.max) && Number(req.session.puzzle.max) !== 0)
            {
                kom = "WYCZERPAŁEŚ LIMIT RUCHÓW! Przegrałeś :<";
                przegrana = true;
            }
            else if(pkt.czarne > req.session.gra.czarne)
                kom = "Świetnie";
            else if(pkt.biale > req.session.gra.biale)
                kom = "Brawo";
            else
                kom = "Buuu";
            req.session.gra.czarne = pkt.czarne;
            req.session.gra.biale = pkt.biale;
            //console.log(move);
            return {
                "retVal": { "wynik": pkt, "wygrana": wygrana, "przegrana": przegrana, "ruchy": req.session.gra.ruchy },
                "retMsg": kom
            };
        };
    res.json(markAnswer());
};
