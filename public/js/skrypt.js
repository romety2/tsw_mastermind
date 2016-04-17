/*jshint globalstrict: true, devel: true, esnext: true, node: true, jquery: true */
'use strict';

$(() => {
    //alert('Zacznij grę!');
    
    var wynikGry = (dane, kom, gra) => {
        var kropki = "";
        var tr= "<tr>";
        $('#wiadomosc').html(kom);
		if(gra.wygrana)
        {
            $('#rozgrywka').html("");
            $('#wiadomosc').css("color", "#008000");
        }
        else if(gra.przegrana)
        {
            $('#rozgrywka').html("");
            $('#wiadomosc').css("color", "#FF0000");
        }
        else
        {
            $('#wiadomosc').css("color", "#000000");
            $('#ruchy').html(gra.ruchy);
			for(let i = 0; i < gra.wynik.czarne; i++)
				kropki += "<span class='pktCzarny'></span>";
			for(let i = 0; i < gra.wynik.biale; i++)
				kropki += "<span class='pktBialy'></span>";
			for(let i = 0; i < dane.length; i++)
				tr+= "<td>" +dane[i]+ "</td>";
			tr += "<td>"+kropki+"</td></tr>";
            $('#tabela').html(tr+$('#tabela').html());
        }
	};
    
    var nowaGraClick = (e) => {
        var size = $('#size').val();
	    var dim = $('#dim').val();
	    var max = $('#max').val();
        var zaznaczone = true;

	    if(isNaN(parseInt(size)) || isNaN(parseInt(dim)) || isNaN(parseInt(max)))
             zaznaczone = false;

        if(zaznaczone)
            $.ajax({
                url: "/play/size/"+size+"/dim/"+dim+"/max/"+max+"/",
                method: 'GET',
                success: function(data){
                    $('#blad').css("display", "none");  
                    nowaGra(data.retMsg, size);
                },
                fail: function(data){
                    $('#gra').html("BŁĄD!");
                    $('#gra').css("color", "#FF0000");
                }
            });
        else
             $('#blad').css("display", "block");   
    };
    
    var okClick = (e) => {
		var link = '';
		var zaznaczone = true;
		var dane = [];
		$('.pole').each((i, el) => {
			if(!isNaN(parseInt(el.value))){
				link += el.value + "/";
				dane.push(el.value);
			}
			else
				zaznaczone = false;
		});
		if(zaznaczone)
			$.ajax({
	            url: "/mark/"+link,
	            method: 'GET',
	            success: function(data){
	                wynikGry(dane, data.retMsg, data.retVal);
	            },
	            fail: function(data){
	                $('#gra').html("BŁĄD!");
                    $('#gra').css("color", "#FF0000");
	            }
		    });
		else
            {
			    $('#wiadomosc').html("Wypełnij wszystkie pola liczbami!");
                $('#wiadomosc').css("color", "#FF0000");
            }
    };
    
    var nowaGra = (msg,rozmiar) => {
		var pola = '';
		var naglowki = '';
		for(let i = 1; i <= rozmiar; i++){
			naglowki += "<th>" + i + "</th>";
			pola += "<td><input type='text' class='pole'/></td>";
		}
		naglowki += "<td><b>Postęp</b></td>";

		var gra = "</br><div><h2 id='gra2'>"+msg+"</h2><h4 id='wiadomosc'>-</h4><div id='rozgrywka'><button id='ok'>OK</button> Ruchy: <span id='ruchy'>0</span>"+
	    "<table><tr>"+naglowki+"</tr><tr>"+pola+"</tr><tbody id='tabela'></tbody></table></div>";
		$('#gra').html(gra);
		$("#ok").click(okClick);
			
	};

    $('#nowa').click(nowaGraClick);
});