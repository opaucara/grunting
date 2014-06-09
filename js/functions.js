window.onload=function(){
	console.log('page loaded.');
};
/////////////////////////////////////////
/*jslint devel: true, unparam: true, sloppy: true, plusplus: true */

// seteo titulo de la pagina segun cliente
var CLIENT_LANGUAGE ='';
var CLIENT_LABEL = '';
var CLIENT_HOME_LINK_LABEL = '';

var maxPlayerAllowGeneral = 2;

var paginationResultPerPage = 10;

function getURLParam(strParamName) {
    "use strict";
    var strReturn = "",
        strHref = window.location.href,
        bFound = false,
        cmpstring = strParamName + "=",
        cmplen = cmpstring.length,
        strQueryString,
        aQueryString,
        iParam,
        aParam;

    if (strHref.indexOf("?") > -1) {
        strQueryString = strHref.substr(strHref.indexOf("?") + 1);
        aQueryString = strQueryString.split("&");
        for (iParam = 0; iParam < aQueryString.length; iParam++) {
            if (aQueryString[iParam].substr(0, cmplen) === cmpstring) {
                aParam = aQueryString[iParam].split("=");
                strReturn = aParam[1];
                bFound = true;
                break;
            }
        }
    }

    if (bFound === false) {
        return null;
    }
    return strReturn;
}

function delete_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function createCookie(token, userName) {
    var teamCookie = '[{"goalkeeper":"0","defender":"0","midfielder":"0","attacker":"0","manager":"0"}, {"miPlayers":""}, {"goalkeeper":1, "defender":4, "midfielder":3, "attacker":3, "manager":1}, {"token":"' + token + '"}, {"league":""}, {"season":""}, {"userName":"' + userName + '"}]';
    return teamCookie;
}

function getCookie(cookie_name) {
    var cookie_value = document.cookie,
        cookie_start = cookie_value.indexOf(" " + cookie_name + "="),
        cookie_end;

    if (cookie_start === -1) {
        cookie_start = cookie_value.indexOf(cookie_name + "=");
    }

    if (cookie_start === -1) {
        cookie_value = null;
    } else {
        cookie_start = cookie_value.indexOf("=", cookie_start) + 1;
        cookie_end = cookie_value.indexOf(";", cookie_start);
        if (cookie_end === -1) {
            cookie_end = cookie_value.length;
        }
        cookie_value = unescape(cookie_value.substring(cookie_start, cookie_end));
    }
    return cookie_value;
}

function setCookie(cookie_name, value, exdays) {
    var exdate = new Date(),
        cookie_value = "";

    if (exdays !== null) {
        exdate.setDate(exdate.getDate() + exdays);
    }

    cookie_value = escape(value) + "; expires=" + exdate.toUTCString();
    document.cookie = cookie_name + "=" + cookie_value;
}

function verifyCookieExist() {
    var miTeamCookie = $.parseJSON(getCookie("players"));

    if (getCookie("players") === null || miTeamCookie[3].token === "") {
        location.href = "/index.html";
    }
}

Array.prototype.clean = function (deleteValue) {
    var i, j;
    for (i = 0, j = this.length; i < j; i++) {
        if (this[i] === deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function addSetHeader(url, data) {
    var title = "",
        selected = ".play";

    switch (url) {
    case "/":
        title = "";
        break;

    case "/index.php":
        title = "";
        break;

    case "/ligas.html":
        title = i18n.getTranslation('txt_choose_league');//;
        selected = ".play";
        break;

    case "/ranking.html":
        title = i18n.getTranslation('txt_ranking'); //;
        selected = ".ranking";
        break;

    case "/mis-equipos.html":
        title = i18n.getTranslation('txt_my_teams'); //;
        selected = ".teams";
        break;

    case "/ver-equipo.html":
        title = i18n.getTranslation('txt_show_team'); //;
        selected = ".play";
        break;

    case "/reglamento.html":
        title = i18n.getTranslation('txt_rules'); //;
        selected = ".rules";
        break;

    case "/exito.html":
        title = i18n.getTranslation('txt_congratulations'); //"";
        selected = "";

        if (document.location.hash === "#suscribe") {
            //title = "Perfil";
            //$("body.subscription-page").addClass("subscription-inactive");
        	console.log("suscription");
        	$(".suscribe").show();
        } else {
            //$("body.subscription-page").addClass("subscription-perfil");
        	$(".team-created").show();
        }

        break;

    case "/premios.html":
        title = i18n.getTranslation('txt_prizes'); //"";
        selected = ".no";
        break;

    case "/editar-equipo.html":
        title = i18n.getTranslation('txt_edit_team'); //"";
        selected = ".no";
        break;

    case "/home.html":
        title = "";
        selected = ".play";
        break;

    case "/perfil.html":
        title = "";
        selected = ".no";
        $(".container-general").css("display", "none");
        $(document.location.hash).show().addClass("active");

        if (document.location.hash !== "#login" && document.location.hash !== "#send-pwd-sms") {
            verifyCookieExist();
        }

        if (document.location.hash === "#subscription-on" || document.location.hash === "#subscription-off") {
            title = i18n.getTranslation('txt_profile');
            $("body.subscription-page").addClass("subscription-inactive");
        } else {
            $("body.subscription-page").addClass("subscription-perfil");
        }
        break;

    case "/suscripcion.html":
	    	title = i18n.getTranslation('txt_suscription'); //"";
	    	selected = "";
	    	break;
    default:
        title = i18n.getTranslation('txt_create_team'); //"";
        selected = ".play";
        break;
    }

    data = data.replace(i18n.getTranslation('txt_create_team'), title);
    $(".header").empty().html(data);
    $(".menu li" + selected).addClass("active");
}

function initialSetTeamCookie(token, cookieName) {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        userName = miTeamCookie[6].userName,
        teamCookie = '[{"goalkeeper":"0","defender":"0","midfielder":"0","attacker":"0","manager":"0"}, {"miPlayers":""}, {"goalkeeper":1, "defender":4, "midfielder":3, "attacker":3, "manager":1}, {"token":"' + token + '"}, {"league":""}, {"season":""}, {"userName":"' + userName + '"}]';

    setCookie(cookieName, teamCookie, 1000);
}

function includeHeader() {
    if ($(".header").length) {

        $.ajax({
            url: "/header.html",
            timeout: 10000,
            dataType: "script",
            success: function (data, status, xhr) {
                data = i18n.translateTemplate(data);                
                addSetHeader(document.location.pathname, data);
                window.scrollTo(0, 0); 

                var miTeamCookie = $.parseJSON(getCookie("players")),
                    token = miTeamCookie[3]["token"] || "";

                if( (document.location.pathname === "/ligas.html" && token === "") || 
                    (document.location.pathname === "/terms.html" && token === "") || 
                    (document.location.pathname === "/crear-equipo.html" && token === "") ) {
                    $("a.show-menu").hide();
                }                 
            }
        });
    }
}

function countPosition(data, position) {
    return data.reduce(function (previousValue, currentValue, index, array) {
        return (currentValue.position === position) ? previousValue + 1 : previousValue;
    }, 0);
}

function shortNamePosition(position) {
    var shortPosition = "";
    switch (position) {
    case "goalkeeper":
        shortPosition = i18n.getTranslation('txt_goalkeeper'); //"AR";
        break;

    case "defender":
        shortPosition = i18n.getTranslation('txt_defender');//"DF";
        break;

    case "midfielder":
        shortPosition = i18n.getTranslation('txt_midfielder');//"MD";
        break;

    case "attacker":
        shortPosition = i18n.getTranslation('txt_attacker');//"DL";
        break;

    case "manager":
        shortPosition = i18n.getTranslation('txt_manager');//"DT";
        break;
    }

    return shortPosition;
}

function createPlayerRow(player, action, shortPosition) {

    var playerClub = "",
        playerRow = "";

    if (player.id_entry === player.id_home) {
        playerClub = player.home;
    } else {
        playerClub = player.away;
    }

    playerRow += '<li class="player-' + action + ' ' + player.position + '">';
    playerRow += '<a data-idp="' + player.id_player + '" data-club="' + playerClub + '"data-idClub="' + player.id_entry + '"  data-name="' + player.full_name + '" data-pos="' + player.position + '" href="#" class="ic-choose ' + action + '"><span class="rol">' + shortPosition + '</span>';
    playerRow += '<span class="player-name">' + player.full_name + '<span class="club">' + playerClub + '</span></span>';
    playerRow += '<span class="ic-arrow">&nbsp;</span></a></li>';

    return playerRow;
}

function createPlayerRowSee(player, action, shortPosition) {
    var clubName,
        clubId,
        playerRow = "";

    if (player.id_home === player.id_entry) {
        clubName = player.home;
        clubId = player.id_home;
    } else {
        clubName = player.away;
        clubId = player.id_away;
    }

    playerRow += '<li class="player-' + action + ' ' + player.position + '">';
    playerRow += '<a data-idp="' + player.id_player + '" data-club="' + clubName + '"data-idClub="' + clubId + '"  data-name="' + player.full_name + '" data-pos="' + player.position + '" href="#" class="ic-choose plus"><span class="rol">' + shortPosition + '</span>';
    playerRow += '<span class="player-name">' + player.full_name + '<span class="club">' + clubName + '</span></span>';
    playerRow += '<span class="ic-arrow">' + player.points + '</span></a>';
    playerRow += '<p class="player-details"></p></li>';

    return playerRow;
}

function createListTeamToEdit(team, miTeamCookie, action) {
    var listOf = [],
        players = "",
        countGoalkepear = countPosition(team, "goalkeeper"),
        countDefender = countPosition(team, "defender"),
        countMidfielder = countPosition(team, "midfielder"),
        countAttacker = countPosition(team, "attacker"),
        countManager = countPosition(team, "manager"),
        listOfPlayers = "",
        teamCookie,
        clubName = "",
        clubId = "",
        shortPosition = "";

    listOf.goalkeeper = listOf.defender = listOf.midfielder = listOf.attacker = listOf.manager = "";

    $.each(team, function (index, value) {
        clubName = clubId = shortPosition = "";

        if (value.id_home === value.id_entry) {
            clubName = value.home;
            clubId = value.id_home;
        } else {
            clubName = value.away;
            clubId = value.id_away;
        }

        players +=  value.position + ":" + value.id_player + ":" + value.full_name + ":" + clubName + ":" + clubId + ",";

        shortPosition = shortNamePosition(value.position);
        if (action === "see-team") {
            listOf[value.position] += createPlayerRowSee(value, "plus", shortPosition);
        } else {
            listOf[value.position] += createPlayerRow(value, "minus", shortPosition);
        }
    });

    teamCookie = '[{"goalkeeper":"' + countGoalkepear + '","defender":"' + countDefender + '","midfielder":"' + countMidfielder + '","attacker":"' + countAttacker + '","manager":"' + countManager + '"}, {"miPlayers":"' + players + '"}, {"goalkeeper":"' + countGoalkepear + '","defender":"' + countDefender + '","midfielder":"' + countMidfielder + '","attacker":"' + countAttacker + '","manager":"' + countManager + '"}, {"token":"' + miTeamCookie[3].token + '"}, {"league":"' + miTeamCookie[4].league + '"}, {"season":"' + miTeamCookie[5].season + '"}, {"userName": "' + miTeamCookie[6].userName + '"}]';

    if (action === "see-team") {
        $(".players-list-edit").remove();
        listOfPlayers += '<ul class="players-list-edit players-list">' + listOf.goalkeeper + listOf.defender + listOf.midfielder + listOf.attacker + listOf.manager + '</ul>';
    } else {
        listOfPlayers += '<ul class="mi-team players-list">' + listOf.goalkeeper + listOf.defender + listOf.midfielder + listOf.attacker + listOf.manager + '</ul>';
        $(".mi-team").remove();    
    }
    $(listOfPlayers).insertAfter(".formations");
    teamCookie[3].token = miTeamCookie[3].token;
    teamCookie[4].league = "";
    teamCookie[5].season = "";

    setCookie("players", teamCookie, 1000);
}

function createListTeamToEditLyF() {
    $(".loading").hide();
    $("body.create-team ul.mi-team").toggleClass("mi-team-edit");
}

function createListFormationLyF(formation) {
    $("ul.formations li.selected").removeClass("selected");

    if (Number(formation.attacker) === 2) {
        if (Number(formation.defender) === 5) {
            $("ul.formations li").eq(3).addClass("selected");
        } else {
            $("ul.formations li").eq(1).addClass("selected");
        }
    } else if (Number(formation.attacker) === 3 && Number(formation.defender) === 3) {
        $("ul.formations li").eq(2).addClass("selected");
    } else {
        $("ul.formations li").eq(0).addClass("selected");
    }
}

function showError(response) {
    var apiResponse,
        message;

    if (response !== "") {
        if (response instanceof Object) {
            message = apiResponse.errors.message;
        } else {
            try {
                apiResponse = $.parseJSON(response);
                if (apiResponse === "null") {
                    message = i18n.getTranslation('msg_service_error');// 'No se ha podido cargar la información. Intentelo nuevamente';
                } else {
                    message = apiResponse.errors.message;
                }
            } catch(e) {
                message = response;
            }
        }
    } else {
        message = i18n.getTranslation('msg_service_error');;
    }

    $("p.msj-error").text(message);
    $("p.msj-error").show();
    setTimeout(function () { $(".msj-error").hide(); }, 3000);
}

function showSuccess(message) {
    $("p.msj-success").text(message);
    $("p.msj-success").show();
    setTimeout(function () { $(".msj-success").hide(); }, 3000);
}

function timeleft(time) {
    var timeRemaining;
    if ((time - 1440) <= 0) {
        if ((time - 60) > 0) {
            timeRemaining = Utils.sprintf(i18n.getTranslation('txt_remaining_hours'), Math.floor(time / 60)); //"Faltan " + Math.floor(time / 60) + " Horas";
        } else {
            timeRemaining = Utils.sprintf(i18n.getTranslation('txt_remaining_minutes'), time);//"Faltan " + time + " Minutos";
        }
    } else if (time < 2880) {
        timeRemaining = Utils.sprintf(i18n.getTranslation('txt_remaining_day'), Math.floor(time / 1440));//"Falta " + Math.floor(time / 1440) + " Día";
    } else {
        timeRemaining = Utils.sprintf(i18n.getTranslation('txt_remaining_days'), (time > 10080 ? " + " : "") + Math.floor(time / 1440));//"Faltan " + (time > 10080 ? " + " : "") + Math.floor(time / 1440) + " Dias";
    }

    return timeRemaining;
}

function urlTreatment() {
    if (document.location.hash !== "") {
        var miTeamCookie = $.parseJSON(getCookie("players")),
            url = document.location.hash.split("="),
            token,
            id_league_user,
            editFormation;

        switch (url[0]) {
        case "#details":
            // showDetailsLeague($("ul.list li.league a.active").attr("data-idLeague"));
            break;

        case "#edit":
            $(".loading").show();

            if(miTeamCookie[4].league !== "" || miTeamCookie[5].season !== "" ) {

                token = miTeamCookie[3].token;
                initialSetTeamCookie("", "seleccion");
                initialSetTeamCookie(token, "players");
                id_league_user = url[1];

                $.ajax({
                    url: API_URL + "/api/me/seats/" + id_league_user + "/players",
                    timeout: 90000,
                    data: {
                        token: token
                    },
                    dataType: "json",
                    success: function (data, status, xhr) {
                        createListTeamToEdit(data, miTeamCookie, "");
                        createListTeamToEditLyF();
                        editFormation = $.parseJSON(getCookie("players"));
                        createListFormationLyF(editFormation[2]);
                    },
                    error: function (status, type, response) {
                        showError(status.response);
                    },
                    complete: function () {
                        $(".loading").hide();
                    }
                });
            } else {
                location.href = "/mis-equipos.html";
            }

            break;
        }
    }
}

/******** LEAGUES **********/

function showLeagues() {
    if (!SINGLE_TOURNAMENT){
        $("div.container-details").hide();
        $("div.container-liga").show();
    }
}

function createLeague(leagues, link) {
    var listOfLeagues = "",
        timeRemaining,
        disable;

    $.each(leagues, function (index, value) {
        timeRemaining = timeleft(value.start_on);

        if (link !== "") {
            disable = (value.active_league == false ? "disable" : "");
            listOfLeagues += '<li class="league-' + value.id_tournament + ' league ' + disable + '"><a data-time-on="' + timeRemaining + '" data-idSeason="' + value.id_season + '" href="#details"><span class="icon">&nbsp;</span><span class="container"><span class="name">' + value.description + '</span><span class="remaining">' + timeRemaining + '</span></span></a></li>';
        } else {
            listOfLeagues += '<li data-idLeague="' + value.id_league + '" class="league-' + value.id_tournament + ' league" data-idSeason="' +  value.id_season+ '"><span class="icon">&nbsp;</span><span class="container"><span class="name">' + value.tournament + '</span><span class="remaining"></span></span></li>';
        }
    });
    return listOfLeagues;
}

function loadLeagues() {
    $(".loading").show();
    var singleTournament = null;

    $.ajax({
        url: API_URL + "/api/tournaments",
        dataType: "json",
        success: function (leagues) {
            if (!SINGLE_TOURNAMENT) {
                var listOfLeagues = createLeague(leagues, 1);
                $("ul#teams").empty();
                $("ul#teams").append(listOfLeagues);
            }else {
                if (leagues.length ){
                    singleTournament = leagues.shift();
                    showDetailsLeague(singleTournament.id_season, timeleft(singleTournament.start_on));
                }
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function showDetailsLeague(idLeague, timeRemaining) {
    $("body.league p.msj-error").hide();

    var matches = "",
        urlAjax = API_URL + "/api/leagues/";

    $.ajax({
        type : "GET",
        data: { "season": idLeague},
        url : urlAjax,
        dataType: "json",
        success: function (eventos) {

            $("p.current-date").text(Utils.sprintf(i18n.getTranslation('txt_games_this_week'), eventos.tournament));            

            $.each(eventos.events, function (index, value) {
                matches += "<li>" + value.home + " vs " + value.away + "</li>";
            });

            $(".container-details ul.list").empty();

            var league = new Array(eventos),
                link = "",
                formatLeague = createLeague(league, link);

            $(".container-details ul.list").append(formatLeague);
            $("ul.matches").empty();
            $("ul.matches").append(matches);
            $("div.container-liga").hide();
            $("div.container-details").show();
            setCookie('current_day_number', eventos.current_day_number, 1000);
        },
        error: function (status, type, response) {
            $(".loading").css("display", "none");
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
            ga('send', 'pageview', '/ligas/detalle/' + idLeague + '.html');
            $("div.container-details ul.list li .container span.remaining").html(timeRemaining);
        }
    });

}

/******** PLAYERS **********/

function getPlayerPoints(element, id_league_user, id_player) {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        description = "",
        token = miTeamCookie[3].token,
        playerId = element.attr("data-idp");

    ga('send', 'pageview', '/ver-equipo/' + id_league_user + '/jugador/' + playerId);

    $.ajax({
        type: "GET",
        url: API_URL + "/api/me/seats/" + id_league_user + "/players/" + playerId + "/incidents",
        data: { "token": token },
        dataType: "json",
        success: function (incidents) {
            $.each(incidents, function (index, value) {
                description += "<span>" + value.description + ": " + value.points + "</span>";
            });
            element.parent("li").children("p.player-details").append(description);
            element.addClass("fulled");
        },
        error: function (status, type, response) {
            if (status.status === 404) {
                element.parent("li").children("p.player-details").append("<span>" + i18n.getTranslation('txt_player_no_points') + "</span>");
                element.addClass("fulled");
            } else {
                showError(status.response);
            }
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function playersClubCount(miPlayer, playerIdClub) {
    var players = miPlayer.split(",").clean(""),
        contador = "",
        playerData;

    $.each(players, function (index, value) {
        playerData = players[index].split(":");
        if (playerData[4] === playerIdClub) {
            contador++;
        }
    });
    return contador;
}

function changeListByIdClubAdd(playerIdClub) {
    $.each($("ul.to-select li.player-plus a"), function (index, value) {
        if ($(value).attr("data-idClub") === playerIdClub && !$(value).parent("li").hasClass("player-minus")) {
            $(value).parent("li.player-plus").removeClass("player-plus").addClass("player-cancel");
        }
    });
}

function changeListByIdClubRemove(playerIdClub) {
    $.each($("ul.to-select li.player-cancel a"), function (index, value) {
        if ($(value).attr("data-idClub") === playerIdClub) {
            $(value).parent("li.player-cancel").removeClass("player-cancel").addClass("player-plus");
            $(value).removeClass("cancel").addClass("plus");
        }
    });
}

function countOccurrenceIdClub(players, playerObj) {
    var count = 0,
        playersList = players.split(","),
        idclub;

    $.each(playersList, function (index, value) {
        idclub = playersList[index].split(":");
        if (idclub === playerObj.attr("data-idClub")) {
            count++;
        }
    });
    return count;
}

function addPlayer(playerObj) {
    var playerId = playerObj.attr("data-idp"),
        playerPosition = playerObj.attr("data-pos"),
        playerName = playerObj.attr("data-name"),
        playerClub = playerObj.attr("data-club"),
        playerIdClub = playerObj.attr("data-idClub"),
        miTeamCookie = $.parseJSON(getCookie("seleccion")),
        miPlayer = miTeamCookie[1].miPlayers,
        playerForClubCount = 0,
        positionCount,
        maxPlayerAllow,
        currentPlayerSelected;

    playerForClubCount = playersClubCount(miPlayer, playerIdClub);

    if (miTeamCookie[0][playerPosition] < miTeamCookie[2][playerPosition] && playerForClubCount < maxPlayerAllowGeneral) {
        positionCount = ++miTeamCookie[0][playerPosition];
        maxPlayerAllow = parseInt(miTeamCookie[2][playerPosition], 10);
        miTeamCookie[1].miPlayers +=  playerPosition + ":" + playerId + ":" + playerName + ":" + playerClub + ":" + playerIdClub + ",";

        miTeamCookie = JSON.stringify(miTeamCookie);
        setCookie("seleccion", miTeamCookie, 1000);

        playerObj.removeClass("plus");
        playerObj.addClass("minus");
        playerObj.parent("li").addClass("player-minus").removeClass("player-plus");

        $('.count-selected').text(positionCount);

        if (positionCount === maxPlayerAllow) {
            window.scrollTo(0, 0);
            $(".player-plus").hide();
            $(".btn-filters").hide();
            $(".player-cancel").hide();
        }
    }

    if (playerForClubCount >= maxPlayerAllowGeneral - 1) {
        changeListByIdClubAdd(playerIdClub);
        playerForClubCount = 0;
    }
}

function removePlayer(playerObj, teamCookie) {
    var miTeamCookie = $.parseJSON(getCookie(teamCookie)),
        players = miTeamCookie[1].miPlayers,
        playerToRemove = playerObj.attr("data-pos") + ":" + playerObj.attr("data-idp") + ":" + playerObj.attr("data-name") + ":" + playerObj.attr("data-club") + ":" + playerObj.attr("data-idClub") + ",",
        positionCount,
        maxPlayerAllow,
        currentPlayerSelected,
        playerIdClub,
        idClubCount;

    players = players.replace(playerToRemove, "");

    $.each(miTeamCookie[0], function (index, value) {
        if (index === playerObj.attr("data-pos")) {

            value--;
            miTeamCookie[0][index] = value;
            miTeamCookie[1].miPlayers = players;

            positionCount = miTeamCookie[0][index];
            maxPlayerAllow = miTeamCookie[2][index];

            miTeamCookie = JSON.stringify(miTeamCookie);
            setCookie(teamCookie, miTeamCookie, 1000);
            playerObj.parent("li").removeClass("player-minus").addClass("player-plus");
            currentPlayerSelected = parseInt($(".count-selected").text(), 10) - 1;
            $('.count-selected').text(currentPlayerSelected);

            if (positionCount < maxPlayerAllow) {
                $(".player-plus").show();
                $(".btn-filters").show();
                $(".player-cancel").show();
            }
        }
    });

    playerIdClub = playerObj.attr("data-idClub");
    idClubCount = countOccurrenceIdClub(players, playerObj);

    if (idClubCount === 0) {
        changeListByIdClubRemove(playerIdClub);
    }
}

function formatPlayer(player, action) {
    var dataPlayer = [],
        shortPosition;

    dataPlayer.position = player[0];
    dataPlayer.id_player = player[1];
    dataPlayer.full_name = player[2];
    dataPlayer.home = player[3];
    dataPlayer.id_entry = player[4];
    dataPlayer.id_home = player[4];

    shortPosition = shortNamePosition(dataPlayer.position);
    if (action !== "minus") {
        action = "plus";
    }

    return createPlayerRow(dataPlayer, action, shortPosition);
}

function createListSelectPlayerJson(listPlayers, formation, position, events) {
    var listOfPlayers = "",
        miTeamCookie,
        playersAlreadySelected,
        playersAlreadyId = [],
        playersClubCount = [],
        player,
        idPlayer,
        action,
        shortPosition;

    if (events === "") {
        setCookie("seleccion", getCookie("players"), 1000);
    }

    miTeamCookie = $.parseJSON(getCookie("seleccion"));
    playersAlreadySelected = miTeamCookie[1].miPlayers.split(",").clean("");
    $.each(playersAlreadySelected, function (index, value) {
        player = value.split(":");
        if (player[0] === position) {
            playersAlreadyId.push(player[1]);
        }
        playersClubCount[player[4]] = ++playersClubCount[player[4]] || 1;
    });

    $.each(listPlayers, function (index, value) {
        if (listPlayers[index].position === position) {
            idPlayer = listPlayers[index].id_player;
            action = "";
            shortPosition = shortNamePosition(listPlayers[index].position);

            // flag para cuando crea la lista selecciona su estado activo, seleccionado, inactivo
            if (playersAlreadyId.indexOf(idPlayer) !== -1) {
                action = "minus";
            } else {
                if (playersClubCount[listPlayers[index].id_entry] === maxPlayerAllowGeneral) {
                    action = "cancel";
                } else {
                    action = "plus";
                }
            }

            listOfPlayers += createPlayerRow(listPlayers[index], action, shortPosition);
        }
    });

    $("#players").html("<ul class='players-list to-select'>" + listOfPlayers + '</ul><a class="btn-back-team" href="javascript:void(0);">' + i18n.getTranslation('btn_save_selection') + '</a>');
}

function createListSelectPlayer(listPlayersCookie) {
    var listPlayers = listPlayersCookie[1].miPlayers.split(","),
        formation = listPlayersCookie[2],
        playerCount = [],
        listOf = [],
        player,
        action,
        replace,
        shortPosition,
        difference,
        i,
        listOfPlayers = "";


    playerCount.goalkeeper = 0;
    playerCount.defender = 0;
    playerCount.midfielder = 0;
    playerCount.attacker = 0;
    playerCount.manager = 0;

    listOf.goalkeeper = "";
    listOf.defender = "";
    listOf.midfielder = "";
    listOf.attacker = "";
    listOf.manager = "";


    $.each(listPlayers, function (index, value) {
        player = listPlayers[index].split(":");
        action = "minus";
        if (player[0] !== "") {
            if ((playerCount[player[0]] < formation[player[0]]) && player[0] !== "goalkeeper" && player[0] !== "manager") {
                listOf[player[0]] += formatPlayer(player, action);
                playerCount[player[0]]++;
            } else if (player[0] === "goalkeeper" || player[0] === "manager") {

                listOf[player[0]] += formatPlayer(player, action);
                playerCount[player[0]] = 1;
            } else {

                replace = listPlayers[index] + ',';
                listPlayersCookie[0][player[0]] = listPlayersCookie[0][player[0]] - 1;
                listPlayersCookie[1].miPlayers = listPlayersCookie[1].miPlayers.replace(replace, "");
            }
        }
    });

    $.each(formation, function (index, value) {
        shortPosition = shortNamePosition(index);
        difference = formation[index] - playerCount[index];
        if (difference > 0) {
            for (i = 1; i <= difference; i++) {
            	text = ( index == "manager" ) ? i18n.getTranslation('txt_select_mgr') : i18n.getTranslation('txt_select_player');
                listOf[index] += '<li class="player-plus ' + index + '"><a data-pos="' + index + '" href="#" class="ic-choose plus"><span class="rol">' + shortPosition + '</span><span class="player-name">' + text + '</span><span class="ic-arrow">&nbsp;</span></a></li>';
            }
        }
    });

    listOfPlayers = '<ul class="mi-team players-list">' + listOf.goalkeeper + listOf.defender + listOf.midfielder + listOf.attacker + listOf.manager + '</ul>';

    listPlayersCookie = JSON.stringify(listPlayersCookie);

    setCookie("players", listPlayersCookie, 1000);

    $(".mi-team").remove();
    $(listOfPlayers).insertAfter(".formations");
}

/*-------- partidos -------*/
/*function loadMatch(contiendas, time_week) {
    var listOfMatchOpen = '',
        listOfMatchClose = '';
    $.each(contiendas.seats, function (index, value) {

        var time = timeleft(value.start_on),
            statusClass = "";
        // if (value.status = "open") {
        //   listOfMatchOpen += '<li><a class="match ic-arrow">' + value.name + '<span>&nbsp;</span></a><div class="team-options"><p>Comienza en ' + time + '</p><a data-idLeague="' + value.id_league + '" data-idSeason="' + value.id_season + '" data-id-league-user="' + value.id_league_user + '" class="btn btn-team-edit" href="#">Editar Equipo</a></div></li>';
        // } else if (value.status === "closed") {
        //   if (value.is_winner === 1) {
        //     statusClass = "winner";
        //   } else {
        //     statusClass = "normal";
        //   }

        //   listOfMatchClose += '<li class="' + statusClass + '"><a class="match ic-arrow">' + value.name + ' (Cerrada)<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>Cerrada</p><p>Posición: ' + value.position + '</p><p>Puntos: ' + value.points + '</p><a class="btn btn-team-edit" href="/ver-equipo.html#equipo=' + value.id_league_user + '">Ver Equipo</a></div></li>';
        // }

        if (time_week === "current_week") {
        	if ( value.status == "open" ) {
        		listOfMatchOpen += '<li><a class="match ic-arrow">' + value.name + '<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user+ '</p><p>' + time + '</p><a data-idLeague="' + value.id_league + '" data-idSeason="' + value.id_season + '" data-id-league-user="' + value.id_league_user + '" class="btn btn-team-edit" href="#">' + i18n.getTranslation('txt_team_edit') + '</a></div></li>';
        	} else if ( value.status == "close" ) {
        		listOfMatchOpen += '<li class="normal"><span class="match-points-right">' + value.points + ' pts</span><a class="match ic-arrow">' + value.name + ' <span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + i18n.getTranslation('txt_Puntos') + ': ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">' + i18n.getTranslation('txt_show_team') + '</a></div></li>';
        	} else {
        		listOfMatchOpen += '<li class="normal"><span class="match-points-right">' + i18n.getTranslation('txt_in_game') + '</span><a class="match ic-arrow">' + value.name + ' <span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + i18n.getTranslation('txt_Puntos') + ': ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">' + i18n.getTranslation('txt_show_team') + '</a></div></li>';
        	}
        } else {
        	if ( value.status == "open" ) {
        		listOfMatchClose += '<li><a class="match ic-arrow">' + value.name + '<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + time + '</p><a data-idLeague="' + value.id_league + '" data-idSeason="' + value.id_season + '" data-id-league-user="' + value.id_league_user + '" class="btn btn-team-edit" href="#">' + i18n.getTranslation('txt_team_edit') + '</a></div></li>';
        	} else if ( value.status == "close" ) { 
        		// listOfMatchClose += '<li class="normal"><a class="match ic-arrow">' + value.name + ' (' + value.points + ' puntos)<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>Puntos: ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">Ver Equipo</a></div></li>';
        		listOfMatchClose += '<li class="normal"><span class="match-points-right">' + value.points + ' pts</span><a class="match ic-arrow">' + value.name + '<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + i18n.getTranslation('txt_Puntos') + ': ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">' + i18n.getTranslation('txt_show_team') + '</a></div></li>';
        	} else {
        		listOfMatchClose += '<li class="normal"><span class="match-points-right">' + i18n.getTranslation('txt_in_game') + '</span><a class="match ic-arrow">' + value.name + ' <span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + i18n.getTranslation('txt_Puntos') + ': ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">' + i18n.getTranslation('txt_show_team') + '</a></div></li>';
        	}
        }
    });

    $(".loading").hide();
    if (contiendas.seats.length == 0) {
    	listOfMatchOpen = listOfMatchClose = "<li>No tienes equipos creados</li>"; 
    }
    
    if (time_week === "current_week") {
        $('.current-week-match .teams-container').html(listOfMatchOpen);
    } else if (time_week === "last_week") {
        $('.last-week-match .teams-container').html(listOfMatchClose);
    } else if (time_week === "next_week") {
        $('.next-week-match .teams-container').html(listOfMatchClose);
    }
    
}*/

function createFilters(matches) {
    var filters = "";
    $.each(matches, function (index, value) {
        filters += '<li class="plus"><a href="#" data-event="' + value.id_event + '"><span class="filter-match"><span>' + value.home + '</span> vs <span>' + value.away + '</span> </span><span class="ic-arrow"></span></a></li>';
    });

    if (filters !== "") {
        $(".filter-list").empty();
        $(".filter-list").append(filters);
    }
}

function callMatches(idSeason) {
    var urlAjax = API_URL + "/api/leagues/";
    $(".loading").show();
    $.ajax({
        type: 'GET',
        url: urlAjax,
        data: {"season": idSeason},
        dataType: "json",
        success: function (filtros) {
            window.scrollTo(0, 0);
            if (idSeason !== "") {
                createFilters(filtros.events);
                location.hash="filter";
                $("#players").toggle();
                $("#filters").toggle();
                $("span.text-title").empty().text(i18n.getTranslation('txt_filter_by_game'));
                $(".count-rol").toggle();
                $("body").toggleClass("show-msj filter-msj");
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
            ga('send', 'pageview', '/equipo/filtrar-partidos.html');
        }
    });
}

function callPlayersFiltersLyF() {
    $("#players").toggle();
    $("#filters").toggle();
    $(".count-rol").toggle();
    $("body").toggleClass("show-msj filter-msj");
    $("span.text-title").empty().text(i18n.getTranslation('txt_select_players'));
}

function callPlayersLyF(playerPosition, positionLimit) {
    location.hash = 'seleccion';
    $(".page-title span.text-title").text(i18n.getTranslation('txt_select_players'));
    var nombrePlayerPosition = "--";
    switch (playerPosition) {
    case "goalkeeper":
        nombrePlayerPosition = i18n.getTranslation('txt_goalkeeper_lbl');
        break;
    case "defender":
        nombrePlayerPosition = i18n.getTranslation('txt_defender_lbl');
        break;
    case "midfielder":
        nombrePlayerPosition = i18n.getTranslation('txt_midfielder_lbl');
        break;
    case "attacker":
        nombrePlayerPosition = i18n.getTranslation('txt_attacker_lbl');
        break;
    case "manager":
        nombrePlayerPosition = i18n.getTranslation('txt_manager_lbl');
        break;
    }

    $("p.count-rol .rol").text(nombrePlayerPosition).attr("position", playerPosition);
    $('.btn-done, .btn-edit-team').toggle();
    // $('.formations').toggle();
    $("#subtitle").toggle();

    $('body').addClass('show-msj');
    // $("h1.page-title a.ic-title").attr("class", "btn-back-general").attr("href", "/crear-equipo.html");
    $('.mi-team').toggle();
    $('#players').toggle();
    $('.count-rol').attr('class', 'count-rol ' + playerPosition).toggle();
    
    $('a.ic-choose.plus span.rol').text();
    $('.count-selected').text(positionLimit[0][playerPosition]);
    $('.maximum-number').text(positionLimit[2][playerPosition]);
}

function callPlayers(playerPosition, events) {
    $(".loading").show();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        id_league = miTeamCookie[4].league,
        urlAjax = API_URL + "/api/leagues/" + id_league + "/events/players/q?",
        formation;

    $.ajax({
        type : "GET",
        data: {
            "position": playerPosition,
            "events": events,
            "offset": 0,
            "limit": 200
        },
        url : urlAjax,
        dataType: "json",
        success: function (data) {
            window.scrollTo(0, 0);
            formation = miTeamCookie[2];
            createListSelectPlayerJson(data, formation, playerPosition, events);
            if (events === "") {
                $(".mi-team li a").addClass("ic-choose");
                callPlayersLyF(playerPosition, miTeamCookie);
            } else {                
                window.history.back();
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
            ga('send', 'pageview', '/equipo/seleccionar-jugadores/' + playerPosition + '.html');
        }
    });
}

function callPlayersFilter(filters) {
    var eventsId = [],
        position = $("div.header p span.count-container span.rol").attr("position");

    $.each(filters, function (index, value) {
        eventsId.push($(value).children("a").attr("data-event"));
    });

    callPlayers(position, eventsId);
    $("span.text-title").empty().text(i18n.getTranslation('txt_players_selection'));
}

/*------- creación de ranking -------*/

function createRanking() {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        time = "last_week",
        token = miTeamCookie[3].token,
        userName = miTeamCookie[6].userName,
        userRank = "",
        myRank,
        lastWeekPoints,
        userRankClass,
        occurrenceUser;
    var callbacksCreateRanking = {
        success: function(ranking){
            var res = BuildMarkUp.dayNumberRankings(ranking);
            $('.day-number-list').append(res);
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    };
    dataservice.getDayNumbersRankingsBySeasonId(DEFAULT_SELECTED_SEASON_ID, token, callbacksCreateRanking);
    
    /*$.ajax({
        type : "GET",
        url : API_URL + "/api/me/stats/ranking/q?",
        data: {
            "token": token,
            "time": time
        },
        dataType: "json",
        success: function (ranking) {
            myRank = ranking.my_rank;
            lastWeekPoints = ranking.points;
            userRankClass = "";
            occurrenceUser = 0;

            $.each(ranking.top_ten, function (index, value) {
                if (index < 10) {
                    if (myRank === value.rank) {
                        userRankClass = "current-user";
                        occurrenceUser = 1;
                    } else {
                        userRankClass = "";
                    }
                    userRank += '<li class="' + userRankClass + '"><span class="position">' + value.rank + '</span><span class="user">' + value.nick + '</span><span class="points">' + value.points + '</span></li>';
                }
            });

            if (occurrenceUser === 0) {
                userRank += '<li class="current-user"><span class="position">' + myRank + '</span><span class="user">' + userName + '</span><span class="points">' + lastWeekPoints + '</span></li>';
            }

            $("ul.user-list").append(userRank);
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });*/
}

/* creacion de la lista de jugadores que se ejecuta cada ves que se carga crear-equipos.html */
function initialFormation() {
    $("#main-content").show();
    var listPlayersCookie = $.parseJSON(getCookie("players")),
        formation = listPlayersCookie[2];

    createListSelectPlayer(listPlayersCookie);
    createListFormationLyF(formation);
}

var createDayNumberHeader = function(){
    //Quick solution, will be removed on future frontend reengineering
  var miTeamCookie = $.parseJSON(getCookie("players")),
      token = miTeamCookie[3].token,
      url = document.location.hash.split("="),
      id_league_user = url[1];

  $.ajax({
    url: API_URL + "/api/me/seats/" + id_league_user,
    timeout: 90000,
    data: {
        token: token
    },
    dataType: "json",
    success: function (data, status, xhr) {
      if (data && data[0] && data[0].day_number){
        //Render de cabecera de dayNumber
        var currentDayNumber = i18n.getTranslation('lbl_round_' + data[0].day_number);
        $('#subtitle-round').text( currentDayNumber?currentDayNumber : 'Fecha actual' );
      }
    }
  });
};

/* funciones que manejan el look and feel */

function showPlayersSelectionLyF() {
    $("#players").toggle();
    $(".mi-team").show();
    $(".btn-filters").show();
    $('.btn-done, .btn-edit-team').toggle();
    $("body").removeClass('show-msj');
    $(".count-rol").toggle();
    // $(".formations").toggle();
    $("#subtitle").toggle();

}

function myTeamsWeek(token, time) {
    var apiResponse;
    var showMoreButton = false;
    $(".loading").show();
    $.ajax({
        type: "GET",
        url: API_URL + "/api/me/seats/q",

        data: {
            "token": token,
            "offset": 0,
            "limit": paginationResultPerPage + 1,
            "time": time
        },
        dataType: "json",
        success: function (contiendas) {

            hideMoreButton = contiendas.seats.length < (paginationResultPerPage + 1);
            if ( !hideMoreButton) {
                $('.' + time).find('.paginator').show();
                contiendas.seats.pop();
                $('.' + time).paginator(token, {
                    offset: paginationResultPerPage,
                    time: time,
                    paginationResultPerPage: paginationResultPerPage
                });
            }
            
            BuildMarkUp.loadMatch(contiendas, time);

        },
        error: function (status, type, response) {
            if (status.status !== 404) {
                if (time !== "last_week") {
                    showError(status.response);
                } else {
                    if (status.response !== "") {
                        apiResponse = $.parseJSON(status.response);
                        $(".last-week-match .msj-error").text(apiResponse.errors.message);
                    } else {
                        $(".last-week-match .msj-error").text(i18n.getTranslation('msg_service_error'));
                    }
                }
            } else {
                $('.'+time+ ' .teams-container').html('<li class="normal"><a class="match ic-arrow" href="#">' + i18n.getTranslation('txt_no_teams') + '</a></li>');
            	/*if ( time == "next_week") {
            		$(".next-week-match .teams-container").html('<li class="normal"><a class="match ic-arrow" href="#">' + i18n.getTranslation('txt_no_teams') + '</a></li>');
            	} else if ( time == "current_week") {
            		$(".current-week-match .teams-container").html('<li class="normal"><a class="match ic-arrow" href="#">' + i18n.getTranslation('txt_no_teams') + '</a></li>');
            	} else {
            		$(".last-week-match .teams-container").html('<li class="normal"><a class="match ic-arrow" href="#">' + i18n.getTranslation('txt_no_teams') + '</a></li>');
            	}*/
            }
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function statsWeek(token) {
    $(".loading").show();

    var headCurrent,
        headLast;

    myTeamsWeek(token, "current_week");
    myTeamsWeek(token, "last_week");
    myTeamsWeek(token, "next_week");
    $.ajax({
        type: "GET",
        url: API_URL + "/api/stats",
        data: {"token": token},
        dataType: "json",
        success: function (user) {
            headCurrent = '<p class="week-date"><span></span></p>';
            headLast = '<p class="week-date"><span>' + Utils.sprintf(i18n.getTranslation('txt_sum_points'), user.last_week_points) + '</span></p>';

            $(".current-week-match .stats").html(headCurrent);
            $(".last-week-match .stats").html(headLast);
            $(".next-week-match .stats").html(headCurrent);
        },
        error: function (status, type, response) {
            if (status === 404) {
                showError(status.response);
            }
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

/*------- EQUIPO --------*/

function saveTeam(miPlayers, formation, id_league, token) {

    var playersId = [];
    $.each(miPlayers, function (index, value) {
        var playerData = value.split(":");
        playersId.push(playerData[1]);
    });

    ga('send', 'pageview', '/guardar-equipo');
    $(".loading").show();
    $.ajax({
        type : "POST",
        data: {
            "id_league": id_league,
            "formation": formation,
            "players": playersId,
            "token": token
        },
        url: API_URL + "/api/me/seats",
        dataType: "json",
        success: function (response) {
            if (response !== "") {
                if (response.errors !== undefined){
                    showError(response.errors.message);
                } else {
                    initialSetTeamCookie("", "seleccion");
                    initialSetTeamCookie(token, "players");
                    location.href = "/exito.html";
                }
            } else {
                location.href = "/error.html";
            }
        },
        error: function (status, type, response) {
        	var json = $.parseJSON(status.response);
        	if ( json.errors.code === 1011 ) {
    			location.href = "/suscripcion.html#create-team";
        	} 
        	else {
        		showError(status.response);	
        	}
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function editTeam(miPlayers, formation, id_league, id_league_user, token) {
    var playersId = [];
    $.each(miPlayers, function (index, value) {
        var playerData = value.split(":");
        playersId.push(playerData[1]);
    });

    $(".loading").show();
    ga('send', 'pageview', '/actualizar-equipo/id_league/' + id_league + '/id_league_user/' + id_league_user);

    $.ajax({
        type : "POST",
        data: {
            "id_league": id_league,
            "id_league_user": id_league_user,
            "formation": formation,
            "players": playersId,
            "token": token
        },
        url: API_URL + "/api/me/seats/" + id_league_user,
        dataType: "json",
        success: function (response) {
            if (response !== "") {
                if (response.errors !== undefined){
                    showError(response);
                } else {
                    initialSetTeamCookie("", "seleccion");
                    initialSetTeamCookie(token, "players");
                    location.href = "/mis-equipos";
                }
            } else {
                location.href = "/error.html";
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function verifySubscription() {
    $(".loading").show();

    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token,
        urlAjax = API_URL + "/api/me/subscriptions";

    $.ajax({
        type : "GET",
        data: {
            "token": token
        },
        url : urlAjax,
        dataType: "json",
        success: function (response) {
            if (response.subscribed === true) {
                location.replace("#subscription-on");
                location.reload();
            } else {
                location.replace("#subscription-off");
                location.reload();
            }
            // $("#user-nick").val(response.nick);
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

/*---- login -----*/

function sendLogin(celNumber, personalPass, action) {
    $('.loading').show();

    $.ajax({
        type : "POST",
        data: {
            "ani": celNumber,
            "pin": personalPass
        },
        url: "/login.php",
        dataType: "json",
        success: function (response) {
            var miTeamCookie,
                miPlayers,
                token = response.token,
                id_league,
                formation,
                teamCookie;

            if (token !== "") {
                if (action === "saveTeam") {

                    miTeamCookie = $.parseJSON(getCookie("players"));

                    miPlayers = miTeamCookie[1].miPlayers.split(",").clean("");
                    id_league = miTeamCookie[4].league;
                    formation = miTeamCookie[0].defender + "-" + miTeamCookie[0].midfielder + "-" + miTeamCookie[0].attacker;

                    miTeamCookie[3].token = token;
                    miTeamCookie = JSON.stringify(miTeamCookie);
                    setCookie("players", miTeamCookie, 1000);

                    saveTeam(miPlayers, formation, id_league, token);

                } else {
                    teamCookie = '[{"goalkeeper":"0","defender":"0","midfielder":"0","attacker":"0","manager":"0"}, {"miPlayers":""}, {"goalkeeper":1, "defender":4, "midfielder":3, "attacker":3, "manager":1}, {"token":"' + token + '"}, {"league":""}, {"season":""}, {"userName":""}]';

                    setCookie("players", teamCookie, 1000);

                    location.href = "/home.html";
                }
            } else {
                showError(response);
            }
        },
        error: function (status, type, response) {
            showError(status.response);
            $('.loading').hide();
        }
    });
}

function backButtonCel() {
    if (window.history && window.history.pushState) {

        $(window).on('popstate', function () {
            var hashLocation = location.hash,
                hashSplit = hashLocation.split("#!/"),
                hashName = hashSplit[1],
                hash;

            if (hashName !== '') {
                hash = window.location.hash;
                if (hash === '') {
                    showLeagues();
                    document.location.hash = "";
                }
            }
        });
        //window.history.pushState('forward', null, './#forward');
    }
}

function setUser(miTeamCookie) {
    var token = miTeamCookie[3].token;

    $.ajax({
        type : "GET",
        data: {
            "token": token
        },
        url: API_URL + "/api/me",
        dataType: "json",
        success: function (user) {
            miTeamCookie[6].userName = user.nick;
            miTeamCookie = JSON.stringify(miTeamCookie);
            setCookie("players", miTeamCookie, 1000);
            $("a.btn-play").css("display", "block");
        },
        error: function (status, type, response) {
            $(".btn-play").attr("href", "/ligas.html");
            $(".btn-play").addClass("btn-play-liga");
            $(".btn-play").css("display", "block");
            $(".login").css("display", "block");
            miTeamCookie[3].token = "";
            miTeamCookie = JSON.stringify(miTeamCookie);
            setCookie("players", miTeamCookie, 1000);
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function homeUserData(userData) {
    var miTeamCookie = $.parseJSON(getCookie("players"));
    miTeamCookie[6].userName = userData.nick;
    miTeamCookie = JSON.stringify(miTeamCookie);

    setCookie("players", miTeamCookie, 1000);

    // current week
    $("body.home div.current-week span.user-name").text(userData.nick);
    // $("body.home div.current-week p.user-points span").text(userData.current_week_points);
    // $("body.home div.current-week p.user-ranking span").text(userData.current_week_rank);
    // $("body.home div.current-week p.user-win span").text(userData.current_week_wins);
    $("body.home div.current-week p.teams-created span.teams-quantity").text(userData.current_week_teams_created);
    $("body.home div.current-week p.teams-created span.team-text").text( (userData.current_week_teams_created == 1) ? i18n.getTranslation('msg_team_created') : i18n.getTranslation('msg_teams_created'));
    
    // last week
    $("body.home div.last-week p.user-ranking span.user-rank").text(userData.last_week_rank);
    $("body.home div.last-week p.user-ranking span.user-points").text(userData.last_week_points);
    $("body.home div.last-week p.user-winner span.user-nick").text(userData.last_week_winner);
    $("body.home div.last-week p.user-winner span.user-points").text(userData.last_week_winner_points);

    if ( userData.subscribed === false ) {
    	$(".banner").show();
    }
}

function getUserStats(token) {
    $.ajax({
        type: "GET",
        data: {
            "token": token
        },
        url: API_URL + "/api/me/stats",
        dataType: "json",
        success: function (userData) {
            homeUserData(userData);
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

/*--------- PRIZE --------*/

function addPrizeLyF(prize) {
    var imgPrize = "";
    $.each(prize, function (index, value) {
        imgPrize += '<li><img src="' + prize.url + '" alt="premio "></li>';
    });
    $("ul.awards-image").append(imgPrize);
}

function callPrizes() {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token;

    $.ajax({
        type : "GET",
        data: {
            "token": token
        },
        url: API_URL + "/api/contents/prize",
        dataType: "json",
        success: function (prize) {
            if (prize !== "") {
                addPrizeLyF(prize);
            } else {
                location.href = "/error.html";
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function showTeam() {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token,
        url = document.location.hash.split("="),
        id_league_user = url[1];

    initialSetTeamCookie("", "seleccion");
    initialSetTeamCookie(token, "players");

    $.ajax({
        url: API_URL + "/api/me/seats/" + id_league_user,
        timeout: 90000,
        data: {
            token: token
        },
        dataType: "json",
        success: function (data, status, xhr) {
            if (data instanceof Array && data[0] !== undefined) {
                $(".header-top").html(
                    "<p" + ((data[0].is_winner) ? ' class="winner">' : '>') + "<span>ID " + id_league_user + "</span>" + data[0].name + "<span>" + i18n.getTranslation('txt_total_points') + ": " + data[0].points + "</span></p>"
                );
            }
        }
    });

    $.ajax({
        url: API_URL + "/api/me/seats/" + id_league_user + "/players",
        timeout: 90000,
        data: {
            token: token
        },
        dataType: "json",
        success: function (data, status, xhr) {
            createListTeamToEdit(data, miTeamCookie, "see-team");

        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

/* suscripcion */
function suscription(token) {

    // suscribo al usuario
   $("#suscribe").click(function() {
    	$(".loading").show();
    	$.ajax({
            type : "POST",
            data: { "token": token },
            url : API_URL + "/api/me/subscriptions/subscribe",
            dataType: "json",
            success: function (subscriptionId, status, xhr) {
            	if ( document.location.hash === "#create-team" ) {
                    miTeamCookie = $.parseJSON(getCookie("players"));

                    miPlayers = miTeamCookie[1].miPlayers.split(",").clean("");
                    id_league = miTeamCookie[4].league;
                    formation = miTeamCookie[0].defender + "-" + miTeamCookie[0].midfielder + "-" + miTeamCookie[0].attacker;

                    miTeamCookie[3].token = token;
                    miTeamCookie = JSON.stringify(miTeamCookie);
                    setCookie("players", miTeamCookie, 1000);

                    saveTeam(miPlayers, formation, id_league, token);
                }
            	else {
            		location.href = "/exito.html" + document.location.hash;
            	}
                
            },
            error: function (status, type, response) {
                showError(status.response);
            },
            complete: function () {
                $(".loading").hide();
            }
        });

    })
}


var callbacksUserTeamByEvent = function(){
    var $loading = $('.loading');
    return {
      success: function (results) {
          if ((paginationResultPerPage+1 > results.length)){
            $('.my-teams-by-event .paginator').hide();
          }else {
            $('.my-teams-by-event .paginator').show();
            results.pop();
          }
          var teamListEl = BuildMarkUp.teamsByEvent(results);
          $('.teamsByEvent').append(teamListEl);
      },
      error: function (status, type, response) {
            if (status.status !== 404) {
                if (options.time !== "last_week") {
                    showError(status.response);
                } else {
                }
            } else {
            }
            $('.my-teams-by-event .paginator').hide();
      },
      complete: function(){
        $loading.hide();
      }
    }
}
var applyBindings = function(){
  var myTeamsPaginatorCounter = 0; 
  var $selectedSeasonId = $('[data-selected-seasonid]');
  var $selectedDayNumber = $('[data-selected-daynumber]');
  var $selectedOffset = $('[data-selected-offset]');
  var $selectedPhase = $('[data-selected-phase]');
  var $selectedRound = $('[data-selected-round]');

  $('.events').on('click', '.event-enabled', function (e) {
    e.preventDefault();
    $('.teamsByEvent').empty();
    $('.my-teams-by-event').show();
    myTeamsPaginatorCounter = 0;
    
    $selectedPhase.attr('data-selected-phase', $(this).attr('data-phase'));
    $selectedRound.attr('data-selected-round', $(this).attr('data-round'));
    var eventData = {phase: $selectedPhase.attr('data-selected-phase'), round: $selectedRound.attr('data-selected-round')};
    var teamListHeaderEl = BuildMarkUp.teamsByEventHeader(eventData);
    $('.teamsByEventHeader').empty().append(teamListHeaderEl);

    fetchMyTeamEventsCreated($(this).attr('data-day-number'), DEFAULT_SELECTED_SEASON_ID, callbacksUserTeamByEvent(), 0);

    $selectedSeasonId.attr('data-selected-seasonid',DEFAULT_SELECTED_SEASON_ID);
    $selectedDayNumber.attr('data-selected-daynumber', $(this).attr('data-day-number'));
    $selectedOffset.attr('data-selected-offset', 0 );
  });

  $('.my-teams-by-event').on('click', '.paginator', (function() {  
        return function(e) {
            e.preventDefault();
            var eventData = {phase: $selectedPhase.attr('data-selected-phase'), round: $selectedRound.attr('data-selected-round')};           
            var teamListHeaderEl = BuildMarkUp.teamsByEventHeader(eventData);
            $('.teamsByEventHeader').empty().append(teamListHeaderEl);
            myTeamsPaginatorCounter += paginationResultPerPage;
            fetchMyTeamEventsCreated($selectedDayNumber.attr('data-selected-daynumber'), $selectedSeasonId.attr('data-selected-seasonid'), callbacksUserTeamByEvent(), myTeamsPaginatorCounter, true);
            
        };
  })());

  $('.day-number-list').on('click', '.day-number-item', function(e){
    $(this).toggleClass('selected-day');
    e.stopPropagation();
    $(this).find('.day-number-ranking').toggle();
  });

  $('.menu .build-team').click(function(){
    initialSetTeamCookie("", "seleccion");  
    initialSetTeamCookie(token, "players");
  });
};

var fetchMyTeamEventsCreated = function(day_number, seasonId, callbacks, count, skip){
    var $loading = $('.loading');
    $('.events').hide();
    
    dataservice.getMyTeamsByEvent(day_number, seasonId, callbacks, count);
    if (!skip){
      location.hash = 'teams';    
    }
};

var loadMyTeamEventsCreated = function(token){
  var $loading = $('.loading');
  $loading.show();
  var callbacks = {
    success: function (results) {
      var res = BuildMarkUp.teamEvents(results);
      $('.events').append(res);
    },
    error: function (status, type, response) {
        $(".msj-error").show();
        setTimeout(function () { $(".msj-error").hide(); }, 3000);
    },
    complete: function(){
      $loading.hide();
    }
  };
  dataservice.getMyTeamEventsCreated(token, null, callbacks);
};

document.addEventListener("DOMContentLoaded", function(event) {
  i18n.translate($('body'));
  includeHeader();
  urlTreatment();
  applyBindings();
});

$(document).on("click", "ul.players-list-edit li a.ic-choose", function (e) {
    e.preventDefault();
    if ($(this).hasClass("fulled")) {
        $(this).parent("li").toggleClass("active");
    } else {
        $(".loading").show();
        $(this).parent("li").toggleClass("active");
        var url = document.location.hash.split("="),
            id_league_user = url[1];

        getPlayerPoints($(this), id_league_user);
    }
});

$(document).on("click", "ul.list li:not(.disable).league a", function (e) {
    e.preventDefault();
    $("body").addClass("active-league");
    $("ul.list li a.active").removeClass("active");
    $(this).addClass("active");
    $(".loading").show();
    showDetailsLeague($(this).attr("data-idSeason"), $(this).attr("data-time-on"));

});

$(document).on("click", "ul.weeks li a.show-week", function (e) {
	$(".weeks li.selected").removeClass("selected");
    $(this).parent("li").toggleClass("selected");

    $("div.last-week-match").hide();
    if ($(this).hasClass("show-last-week")) $("div.last-week-match").show();
    
    $("div.current-week-match").hide();
    if ($(this).hasClass("show-current-week")) $("div.current-week-match").show();
    
    $("div.next-week-match").hide();
    if ($(this).hasClass("show-next-week")) $("div.next-week-match").show();
});

/*$(document).on("click", "ul.weeks li a.show-week", function (e) {
    e.preventDefault();
    if (!$(this).parent("li").hasClass("selected")) {
        $(".weeks li.selected").removeClass("selected");
        $(this).parent("li").toggleClass("selected");
        $("div.last-week-match").toggle();
        $("div.current-week-match").toggle();
        $("div.next-week-match").toggle();

        if ($(this).hasClass("show-last-week")) 
        {
            if ($(".last-week-error").text() !== "") 
            {
                $(".last-week-match .msj-error").show();
            }
        } else if ($(this).hasClass("show-current-week")) {
            $(".last-week-error").hide();
        } else if ($(this).hasClass("show-next-week")) {
        	$(".next-week-error").hide();
        }
    }
});*/

/* funcionalidades para los filtros */
$(document).on("click", ".btn-filters", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players"));
    callMatches(miTeamCookie[5].season);
    $("body").addClass("filtros");
    $(".msj-filtro").hide();
});

$(document).on("click", "#filters .filter-list li a", function (e) {
    e.preventDefault();
    if ($(this).parent("li").hasClass("minus")) {
        $(this).parent("li").toggleClass("plus minus");
    } else {
        $(this).parent("li").toggleClass("minus plus");
    }
});

$(document).on("click", "a.apply-filter", function (e) {
    e.preventDefault();
    if ($("ul.filter-list li.minus").length > 0) {
        callPlayersFilter($("ul.filter-list li.minus"));
    } else {
        $(".msj-filtro").show();
    }
});

$(document).on("click", ".btn-done", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        totalPlayers = parseInt(miTeamCookie[0].goalkeeper, 10) + parseInt(miTeamCookie[0].defender, 10) + parseInt(miTeamCookie[0].midfielder, 10) + parseInt(miTeamCookie[0].attacker, 10) + parseInt(miTeamCookie[0].manager, 10),
        miPlayers = miTeamCookie[1].miPlayers.split(",").clean(""),
        token = miTeamCookie[3].token,
        id_league = miTeamCookie[4].league,
        formation = $("ul.formations li.selected a").text();

    if (totalPlayers === 12 && token !== "") {
        saveTeam(miPlayers, formation, id_league, token);
    } else if (totalPlayers !== 12) {
        $(".msj-error").show();
        setTimeout(function () { $(".msj-error").hide(); }, 3000);
    } else {
        location.href = "/perfil.html#login";
    }
});


$(document).on("click", '.formations li a', function (e) {
    e.preventDefault();
    var formationId = $(this).attr('data-id'),
        listOfPlayers = $('.mi-team li'),
        currentFormation = $.parseJSON(getCookie("players")),
        listPlayersCookie;

    $('.formations li.selected').removeClass('selected');
    $(this).parent('li').toggleClass("selected");
    $('.mi-team li.hide').removeClass('hide');

    switch (formationId) {
    case '1':
        $.each(listOfPlayers, function (index, value) {
            if (index === 5 || index === 9 || index === 13) {
                value.className += ' hide';
            }
        });
        currentFormation[2].goalkeeper = 1;
        currentFormation[2].defender = 4;
        currentFormation[2].midfielder = 3;
        currentFormation[2].attacker = 3;

        break;

    case '2':
        $.each(listOfPlayers, function (index, value) {
            if (index === 5 || index === 12) {
                value.className += ' hide';
            }
        });
        currentFormation[2].goalkeeper = 1;
        currentFormation[2].defender = 4;
        currentFormation[2].midfielder = 4;
        currentFormation[2].attacker = 2;

        break;

    case '3':
        $.each(listOfPlayers, function (index, value) {
            if (index === 4 || index === 5) {
                value.className += ' hide';
            }
        });
        currentFormation[2].goalkeeper = 1;
        currentFormation[2].defender = 3;
        currentFormation[2].midfielder = 4;
        currentFormation[2].attacker = 3;

        break;

    case '4':
        $.each(listOfPlayers, function (index, value) {
            if (index === 9 || index === 12) {
                value.className += ' hide';
            }
        });
        currentFormation[2].goalkeeper = 1;
        currentFormation[2].defender = 5;
        currentFormation[2].midfielder = 3;
        currentFormation[2].attacker = 2;

        break;
    }
    currentFormation = JSON.stringify(currentFormation);
    setCookie("players", currentFormation, 1000);

    listPlayersCookie = $.parseJSON(getCookie("players"));
    createListSelectPlayer(listPlayersCookie);
});

$(document).on("click", '.mi-team li a.ic-choose', function (e) {
    e.preventDefault();
    var playerPosition = $(this).attr('data-pos'),
        events,
        listPlayersCookie;

    if ($(this).hasClass("minus")) {

        $(this).removeClass("minus").addClass("plus");
        $(this).addClass("plus");
        removePlayer($(this), "players");

        listPlayersCookie = $.parseJSON(getCookie("players"));
        createListSelectPlayer(listPlayersCookie);
    } else {
        events = "";
        $(".mi-team li a").removeClass("ic-choose");
        $("body").addClass("bk-create-team");
        callPlayers(playerPosition, events);            
    }
});

/* boton seleccion de jugador llamado de ajax a los jugadores */
$(document).on("click", '.to-select li a.ic-choose', function (e) {
    e.preventDefault();

    if ($(this).hasClass("plus")) {
        addPlayer($(this));
    } else if ($(this).hasClass("minus")) {
        $(this).removeClass("minus");
        $(this).addClass("plus");
        removePlayer($(this), "seleccion");
    }
});

/* boton para volver a creacion de equipo */
$(document).on("click", '.btn-back-team', function (e) {
    e.preventDefault();
    setCookie("players", getCookie("seleccion"), 1000);
    var listPlayersCookie = $.parseJSON(getCookie("players"));

    window.scrollTo(0, 0);
    createListSelectPlayer(listPlayersCookie);
    showPlayersSelectionLyF();
    if ($("body").hasClass("editar-team")) {
        $("span.text-title").empty().text(i18n.getTranslation('txt_edit_team'));
    } else {
        $("span.text-title").empty().text(i18n.getTranslation('txt_create_team'));
    }
    $("body").removeClass("bk-create-team");
    window.history.back();
});

$(document).on("click", "a.btn-team-edit", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players"));

    miTeamCookie[4].league = $(this).attr("data-idLeague");
    miTeamCookie[5].season = $(this).attr("data-idSeason");
    miTeamCookie = JSON.stringify(miTeamCookie);
    setCookie("players", miTeamCookie, 1000);
    location.href = "/editar-equipo.html#edit=" + $(this).attr("data-id-league-user");
});

$(document).on("click", "a.btn-edit-team", function (e) {
    e.preventDefault();

    var miTeamCookie = $.parseJSON(getCookie("players")),
        totalPlayers = parseInt(miTeamCookie[0].goalkeeper, 10) + parseInt(miTeamCookie[0].defender, 10) + parseInt(miTeamCookie[0].midfielder, 10) + parseInt(miTeamCookie[0].attacker, 10) + parseInt(miTeamCookie[0].manager, 10),
        miPlayers = miTeamCookie[1].miPlayers.split(",").clean(""),
        token = miTeamCookie[3].token,
        id_league = miTeamCookie[4].league,
        formation = $("ul.formations li.selected a").text(),
        url = document.location.hash.split("="),
        id_league_user = url[1];

    if (totalPlayers === 12 && token !== "") {
        editTeam(miPlayers, formation, miTeamCookie[4].league, id_league_user, token);
    } else if (totalPlayers !== 12) {
        $(".msj-error").show();
        setTimeout(function () { $(".msj-error").hide(); }, 3000);
    } else {
        location.href = "/perfil.html#login";
    }
});

$(document).on("click", "a.btn-confirm-league", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players"));
    miTeamCookie[4].league = $(".container-details ul.list li.league").attr("data-idLeague");
    miTeamCookie[5].season = $(".container-details ul.list li.league").attr("data-idSeason");
    miTeamCookie = JSON.stringify(miTeamCookie);
    setCookie("players", miTeamCookie, 1000);
    location.href = "/crear-equipo.html";
});

function crearEquipoInit()
{
    
    // toma los datos de la liga seleccionada
    var miTeamCookie = $.parseJSON(getCookie("players"));
    var id_league = miTeamCookie[4].league;
    var id_season = miTeamCookie[5].season;

    
    // si selecciono torneo está todo ok.
    if ( id_league && id_season )
    {
        var miTeamCookie = $.parseJSON(getCookie("players"));
        miTeamCookie[4].league = id_league
        miTeamCookie[5].season = id_season;
        miTeamCookie = JSON.stringify(miTeamCookie);
        setCookie("players", miTeamCookie, 1000);
        
        initialFormation();
        var currentDayNumber = i18n.getTranslation('lbl_round_' + getCookie("current_day_number"));
        $('#subtitle-round').text( currentDayNumber?currentDayNumber : 'Fecha actual' );
    }
    else // si no selecciono torneo se carga el default.
    {
        $(".loading").show();

        var miTeamCookie = $.parseJSON(getCookie("players"));
        initialSetTeamCookie("", "seleccion");
        initialSetTeamCookie(miTeamCookie[3].token, "players");

        var id_season = "";
        var remain = "";
        var show_create_team = false;
        
        $.ajax({
            url: API_URL + "/api/tournaments",
            dataType: "json",
            success: function (leagues) {

                $.each(leagues, function(index, value) {
                    // si encontre la liga argentina y está habilitada cargo la vista crear equipo
                    if ( (typeof DEFAULT_SELECTED_SEASON_ID != 'undefined') && 
                         value.id_season == DEFAULT_SELECTED_SEASON_ID &&
                         value.active_league == true) {
                        id_season = value.id_season;
                        show_create_team = true;

                        return false;
                    }
                });
                
                if (show_create_team == true)
                {
                    $.ajax({
                        type : "GET",
                        data: { "season": id_season},
                        url : API_URL + "/api/leagues/",
                        dataType: "json",
                        success: function (league) {

                            var miTeamCookie = $.parseJSON(getCookie("players"));
                            miTeamCookie[4].league = league.id_league
                            miTeamCookie[5].season = id_season;
                            miTeamCookie = JSON.stringify(miTeamCookie);
                            setCookie("players", miTeamCookie, 1000);
                            setCookie('current_day_number', league.current_day_number, 1000);
                            var currentDayNumber = i18n.getTranslation('lbl_round_' + getCookie("current_day_number"));
                            $('#subtitle-round').text( currentDayNumber?currentDayNumber : 'Fecha actual' );


                            
                            // location.href = "/crear-equipo.html";
                            initialFormation();
                            return false;
                        },
                        error: function() {
                            location.href = "/ligas.html";
                        },
                        complete: function() {
                            $(".loading").hide();
                        }
                    });
                }
                else
                {
                    location.href = "/ligas.html";
                }
            },
            error: function() {
                location.href = "/ligas.html";
            }
        });     
    }

}
/*------- Edicion de usuario -------*/

$(document).on("click", "body.subscription-page a.btn-edit-user", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        newNick = $(this).siblings("input.input-sub-on").val(),
        token = miTeamCookie[3].token;

    if (newNick !== "") {
        $(".loading").show();
        $.ajax({
            type: "POST",
            url: API_URL + "/api/me/",
            data: {"token": token, "nick": newNick},
            dataType: "json",
            success: function (response) {
//
            },
            error: function (status, type, response) {
                showError(status.response);
            },
            complete: function () {
                $(".loading").hide();
            }
        });
    } else {
        showError(i18n.getTranslation('txt_name_field_incomplete'));
    }
});

/*------ envio de informacion por las paginas de suscripcion ------*/
$(document).on("click", "a.login-user", function (e) {
    e.preventDefault();
    var celNumberLine = $('.cel-number').val().toString(),
        celNumberPrefix = $('.cel-number-prefix').val().toString(),
        personalPass = $(".personal-pass").val(),
        messageError = i18n.getTranslation('txt_error_entrada_telefono'),
        miTeamCookie = $.parseJSON(getCookie("players")),
        miPlayers,
        action = "";

    if (getCookie("players") !== null) {
        miPlayers = miTeamCookie[1].miPlayers.split(",").clean("");
        if (miPlayers.length > 0) {
            action = "saveTeam";
        }
    }

    celNumber = celNumberPrefix + celNumberLine;

    if (/^([0-9])*$/.test(celNumber) && celNumberPrefix.length !== 0 && celNumberLine.length !== 0 && personalPass.length !== 0) {
        sendLogin(celNumber, personalPass, action);
    } else {
        $("#login .msj-error").text(messageError).show();
        setTimeout(function () { $("#login .msj-error").hide(); }, 3000);
    }

});

$(document).on("click", "a.send-pass-sms", function (e) {
    e.preventDefault();
    location.hash = "send-pwd-sms";
    location.reload();
});

$(document).on("click", "a.send-sms", function (e) {
    e.preventDefault();
    var ani = $("input.input-sms").val().toString();
    var aniPrefix = $("input.input-sms-prefix").val().toString();
    var $msjError = $(this).siblings('.msj-error'); 

    $msjError.hide();

    $("input.input-sms")
    var pinValidationRegex = new RegExp(PIN_VALIDATION_REGEX,"g");
    var lineNumber = aniPrefix + ani;

    if (ani.length && aniPrefix.length && pinValidationRegex.test(lineNumber)) {
        $.ajax({
            type: "POST",
            url: API_URL + "/api/me/pin/reset/",
            data: {
                "ani": lineNumber
            },
            dataType: "json",
            success: function () {
                $('.loading').hide();
                location.hash = "login";
                location.reload();
            },
            error: function (status, type, response) {
                $('.loading').hide();
                showError(status.response);
            },
            complete: function () {
                $('.loading').hide();
            }
        });
    } else {
        $msjError.text(i18n.getTranslation('msg_invalid_phone_number')).show();
        setTimeout(function () { $msjError.hide(); }, 3000);
    }

});

$(document).on("click", "a.btn-back", function (e) {
    window.history.back();
});

/*------- suscripcion --------*/

/*------ subcribirse --------*/
$(document).on("click", "a.activate-subscription", function (e) {
    e.preventDefault();
    ga('send', 'pageview', '/perfil.html#btn-activar-subscripcion');
    $(".loading").show();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token;

    $.ajax({
        type : "POST",
        data: { "token": token},
        url : API_URL + "/api/me/subscriptions/subscribe",
        dataType: "json",
        success: function (subscriptionId, status, xhr) {
            location.href = "/exito.html#suscribe";
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
});

/*------ desubcribirse --------*/

$(document).on("click", "a.deactivate-subscription", function (e) {
    e.preventDefault();
    ga('send', 'pageview', '/perfil.html#btn-desactivar-subscripcion');
    $(".loading").show();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token;

    $.ajax({
        type : "POST",
        data: { "token": token},
        url : API_URL + "/api/me/subscriptions/unsubscribe",
        dataType: "json",
        success: function (subscriptionId, status, xhr) {
            location.hash = "subscription-off";
            location.reload();
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
});

/*----- COMPLEMENTOS -----*/
window.onhashchange = function() { 
    /* esto se ejecuta cuando se vuelve de jugadores a seleccionar a crea tu equipo*/
    if ($("body").hasClass("bk-create-team") && !(location.hash === '#seleccion' || location.hash === '#filter')) {
        $("body").removeClass("bk-create-team");
        createListSelectPlayer($.parseJSON(getCookie("players")));
        showPlayersSelectionLyF();
        if ($("body").hasClass("editar-team")) {
            $("span.text-title").empty().text(i18n.getTranslation('txt_edit_team'));
        } else {
            $("span.text-title").empty().text(i18n.getTranslation('txt_create_team'));
        }
    }
    /* esto se ejecuta cuando se vuelve de filtros a seleccion de lista de jugadores a seleccionar */
    if ($("body").hasClass("filtros") && location.hash !== '#filter') {
        $("#players").show();
        $("p.count-rol").show();
        $("#filters").hide();
        $("body").removeClass("filtros").addClass("bk-create-team");
        $("body").toggleClass("show-msj filter-msj");
        $("body").removeClass("filtros filter-msj").addClass("bk-create-team show-msj");
        $("span.text-title").empty().text(i18n.getTranslation('txt_select_players'));
    }

    //returns from mis-equipos#teams to mis-equipos
    if ( document.location.pathname === '/mis-equipos.html' &&  document.location.hash != '#teams'){
      $('.my-teams-by-event').hide();
      $('.events').show();
    }
    
    /* esto se ejecuta cuando se vuelve de reset pin */
    if ($("body").hasClass("profile") && location.hash === '#login') { 
    	location.reload();
    }
}

$(document).on("click", ".history-back", function (e) {
    e.preventDefault();
    if (($("body").hasClass("subscription-perfil") || $("body").hasClass("home")) && $(this).text() !== i18n.getTranslation('txt_volver')) {
        if ($("#subscription").hasClass("active")) {
            window.history.back();
        }
    } else if ($("body").hasClass("league")) {
        if (!$("body.league").hasClass("active-league")) {
            var miTeamCookie = $.parseJSON(getCookie("players")),
                token = miTeamCookie[3]["token"] || "";
            location.href = (token === "")? "/index.html" : "/home.html";
        } else {
            $("body.active-league").removeClass("active-league");
            location.reload();
        }
    } else {
        window.history.back();
    }
});

/* banner */
$(document).on("click", ".banner", function (e) {
    e.preventDefault();
    ga('send', 'pageview', '/suscripcion.html');
    
    location.href = "suscripcion.html#suscribe";
});
//////////////////
/*jslint devel: true, unparam: true, sloppy: true, plusplus: true */

// seteo titulo de la pagina segun cliente

var maxPlayerAllowGeneral = 2;

var paginationResultPerPage = 10;

function getURLParam(strParamName) {
    "use strict";
    var strReturn = "",
        strHref = window.location.href,
        bFound = false,
        cmpstring = strParamName + "=",
        cmplen = cmpstring.length,
        strQueryString,
        aQueryString,
        iParam,
        aParam;

    if (strHref.indexOf("?") > -1) {
        strQueryString = strHref.substr(strHref.indexOf("?") + 1);
        aQueryString = strQueryString.split("&");
        for (iParam = 0; iParam < aQueryString.length; iParam++) {
            if (aQueryString[iParam].substr(0, cmplen) === cmpstring) {
                aParam = aQueryString[iParam].split("=");
                strReturn = aParam[1];
                bFound = true;
                break;
            }
        }
    }

    if (bFound === false) {
        return null;
    }
    return strReturn;
}

function delete_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function createCookie(token, userName) {
    var teamCookie = '[{"goalkeeper":"0","defender":"0","midfielder":"0","attacker":"0","manager":"0"}, {"miPlayers":""}, {"goalkeeper":1, "defender":4, "midfielder":3, "attacker":3, "manager":1}, {"token":"' + token + '"}, {"league":""}, {"season":""}, {"userName":"' + userName + '"}]';
    return teamCookie;
}

function getCookie(cookie_name) {
    var cookie_value = document.cookie,
        cookie_start = cookie_value.indexOf(" " + cookie_name + "="),
        cookie_end;

    if (cookie_start === -1) {
        cookie_start = cookie_value.indexOf(cookie_name + "=");
    }

    if (cookie_start === -1) {
        cookie_value = null;
    } else {
        cookie_start = cookie_value.indexOf("=", cookie_start) + 1;
        cookie_end = cookie_value.indexOf(";", cookie_start);
        if (cookie_end === -1) {
            cookie_end = cookie_value.length;
        }
        cookie_value = unescape(cookie_value.substring(cookie_start, cookie_end));
    }
    return cookie_value;
}

function setCookie(cookie_name, value, exdays) {
    var exdate = new Date(),
        cookie_value = "";

    if (exdays !== null) {
        exdate.setDate(exdate.getDate() + exdays);
    }

    cookie_value = escape(value) + "; expires=" + exdate.toUTCString();
    document.cookie = cookie_name + "=" + cookie_value;
}

function verifyCookieExist() {
    var miTeamCookie = $.parseJSON(getCookie("players"));

    if (getCookie("players") === null || miTeamCookie[3].token === "") {
        location.href = "/index.html";
    }
}

Array.prototype.clean = function (deleteValue) {
    var i, j;
    for (i = 0, j = this.length; i < j; i++) {
        if (this[i] === deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function addSetHeader(url, data) {
    var title = "",
        selected = ".play";

    switch (url) {
    case "/":
        title = "";
        break;

    case "/index.php":
        title = "";
        break;

    case "/ligas.html":
        title = i18n.getTranslation('txt_choose_league');//;
        selected = ".play";
        break;

    case "/ranking.html":
        title = i18n.getTranslation('txt_ranking'); //;
        selected = ".ranking";
        break;

    case "/mis-equipos.html":
        title = i18n.getTranslation('txt_my_teams'); //;
        selected = ".teams";
        break;

    case "/ver-equipo.html":
        title = i18n.getTranslation('txt_show_team'); //;
        selected = ".play";
        break;

    case "/reglamento.html":
        title = i18n.getTranslation('txt_rules'); //;
        selected = ".rules";
        break;

    case "/exito.html":
        title = i18n.getTranslation('txt_congratulations'); //"";
        selected = "";

        if (document.location.hash === "#suscribe") {
            //title = "Perfil";
            //$("body.subscription-page").addClass("subscription-inactive");
        	console.log("suscription");
        	$(".suscribe").show();
        } else {
            //$("body.subscription-page").addClass("subscription-perfil");
        	$(".team-created").show();
        }

        break;

    case "/premios.html":
        title = i18n.getTranslation('txt_prizes'); //"";
        selected = ".no";
        break;

    case "/editar-equipo.html":
        title = i18n.getTranslation('txt_edit_team'); //"";
        selected = ".no";
        break;

    case "/home.html":
        title = "";
        selected = ".play";
        break;

    case "/perfil.html":
        title = "";
        selected = ".no";
        $(".container-general").css("display", "none");
        $(document.location.hash).show().addClass("active");

        if (document.location.hash !== "#login" && document.location.hash !== "#send-pwd-sms") {
            verifyCookieExist();
        }

        if (document.location.hash === "#subscription-on" || document.location.hash === "#subscription-off") {
            title = i18n.getTranslation('txt_profile');
            $("body.subscription-page").addClass("subscription-inactive");
        } else {
            $("body.subscription-page").addClass("subscription-perfil");
        }
        break;

    case "/suscripcion.html":
	    	title = i18n.getTranslation('txt_suscription'); //"";
	    	selected = "";
	    	break;
    default:
        title = i18n.getTranslation('txt_create_team'); //"";
        selected = ".play";
        break;
    }

    data = data.replace(i18n.getTranslation('txt_create_team'), title);
    $(".header").empty().html(data);
    $(".menu li" + selected).addClass("active");
}

function initialSetTeamCookie(token, cookieName) {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        userName = miTeamCookie[6].userName,
        teamCookie = '[{"goalkeeper":"0","defender":"0","midfielder":"0","attacker":"0","manager":"0"}, {"miPlayers":""}, {"goalkeeper":1, "defender":4, "midfielder":3, "attacker":3, "manager":1}, {"token":"' + token + '"}, {"league":""}, {"season":""}, {"userName":"' + userName + '"}]';

    setCookie(cookieName, teamCookie, 1000);
}

function includeHeader() {
    if ($(".header").length) {

        $.ajax({
            url: "/header.html",
            timeout: 10000,
            dataType: "script",
            success: function (data, status, xhr) {
                data = i18n.translateTemplate(data);                
                addSetHeader(document.location.pathname, data);
                window.scrollTo(0, 0); 

                var miTeamCookie = $.parseJSON(getCookie("players")),
                    token = miTeamCookie[3]["token"] || "";

                if( (document.location.pathname === "/ligas.html" && token === "") || 
                    (document.location.pathname === "/terms.html" && token === "") || 
                    (document.location.pathname === "/crear-equipo.html" && token === "") ) {
                    $("a.show-menu").hide();
                }                 
            }
        });
    }
}

function countPosition(data, position) {
    return data.reduce(function (previousValue, currentValue, index, array) {
        return (currentValue.position === position) ? previousValue + 1 : previousValue;
    }, 0);
}

function shortNamePosition(position) {
    var shortPosition = "";
    switch (position) {
    case "goalkeeper":
        shortPosition = i18n.getTranslation('txt_goalkeeper'); //"AR";
        break;

    case "defender":
        shortPosition = i18n.getTranslation('txt_defender');//"DF";
        break;

    case "midfielder":
        shortPosition = i18n.getTranslation('txt_midfielder');//"MD";
        break;

    case "attacker":
        shortPosition = i18n.getTranslation('txt_attacker');//"DL";
        break;

    case "manager":
        shortPosition = i18n.getTranslation('txt_manager');//"DT";
        break;
    }

    return shortPosition;
}

function createPlayerRow(player, action, shortPosition) {

    var playerClub = "",
        playerRow = "";

    if (player.id_entry === player.id_home) {
        playerClub = player.home;
    } else {
        playerClub = player.away;
    }

    playerRow += '<li class="player-' + action + ' ' + player.position + '">';
    playerRow += '<a data-idp="' + player.id_player + '" data-club="' + playerClub + '"data-idClub="' + player.id_entry + '"  data-name="' + player.full_name + '" data-pos="' + player.position + '" href="#" class="ic-choose ' + action + '"><span class="rol">' + shortPosition + '</span>';
    playerRow += '<span class="player-name">' + player.full_name + '<span class="club">' + playerClub + '</span></span>';
    playerRow += '<span class="ic-arrow">&nbsp;</span></a></li>';

    return playerRow;
}

function createPlayerRowSee(player, action, shortPosition) {
    var clubName,
        clubId,
        playerRow = "";

    if (player.id_home === player.id_entry) {
        clubName = player.home;
        clubId = player.id_home;
    } else {
        clubName = player.away;
        clubId = player.id_away;
    }

    playerRow += '<li class="player-' + action + ' ' + player.position + '">';
    playerRow += '<a data-idp="' + player.id_player + '" data-club="' + clubName + '"data-idClub="' + clubId + '"  data-name="' + player.full_name + '" data-pos="' + player.position + '" href="#" class="ic-choose plus"><span class="rol">' + shortPosition + '</span>';
    playerRow += '<span class="player-name">' + player.full_name + '<span class="club">' + clubName + '</span></span>';
    playerRow += '<span class="ic-arrow">' + player.points + '</span></a>';
    playerRow += '<p class="player-details"></p></li>';

    return playerRow;
}

function createListTeamToEdit(team, miTeamCookie, action) {
    var listOf = [],
        players = "",
        countGoalkepear = countPosition(team, "goalkeeper"),
        countDefender = countPosition(team, "defender"),
        countMidfielder = countPosition(team, "midfielder"),
        countAttacker = countPosition(team, "attacker"),
        countManager = countPosition(team, "manager"),
        listOfPlayers = "",
        teamCookie,
        clubName = "",
        clubId = "",
        shortPosition = "";

    listOf.goalkeeper = listOf.defender = listOf.midfielder = listOf.attacker = listOf.manager = "";

    $.each(team, function (index, value) {
        clubName = clubId = shortPosition = "";

        if (value.id_home === value.id_entry) {
            clubName = value.home;
            clubId = value.id_home;
        } else {
            clubName = value.away;
            clubId = value.id_away;
        }

        players +=  value.position + ":" + value.id_player + ":" + value.full_name + ":" + clubName + ":" + clubId + ",";

        shortPosition = shortNamePosition(value.position);
        if (action === "see-team") {
            listOf[value.position] += createPlayerRowSee(value, "plus", shortPosition);
        } else {
            listOf[value.position] += createPlayerRow(value, "minus", shortPosition);
        }
    });

    teamCookie = '[{"goalkeeper":"' + countGoalkepear + '","defender":"' + countDefender + '","midfielder":"' + countMidfielder + '","attacker":"' + countAttacker + '","manager":"' + countManager + '"}, {"miPlayers":"' + players + '"}, {"goalkeeper":"' + countGoalkepear + '","defender":"' + countDefender + '","midfielder":"' + countMidfielder + '","attacker":"' + countAttacker + '","manager":"' + countManager + '"}, {"token":"' + miTeamCookie[3].token + '"}, {"league":"' + miTeamCookie[4].league + '"}, {"season":"' + miTeamCookie[5].season + '"}, {"userName": "' + miTeamCookie[6].userName + '"}]';

    if (action === "see-team") {
        $(".players-list-edit").remove();
        listOfPlayers += '<ul class="players-list-edit players-list">' + listOf.goalkeeper + listOf.defender + listOf.midfielder + listOf.attacker + listOf.manager + '</ul>';
    } else {
        listOfPlayers += '<ul class="mi-team players-list">' + listOf.goalkeeper + listOf.defender + listOf.midfielder + listOf.attacker + listOf.manager + '</ul>';
        $(".mi-team").remove();    
    }
    $(listOfPlayers).insertAfter(".formations");
    teamCookie[3].token = miTeamCookie[3].token;
    teamCookie[4].league = "";
    teamCookie[5].season = "";

    setCookie("players", teamCookie, 1000);
}

function createListTeamToEditLyF() {
    $(".loading").hide();
    $("body.create-team ul.mi-team").toggleClass("mi-team-edit");
}

function createListFormationLyF(formation) {
    $("ul.formations li.selected").removeClass("selected");

    if (Number(formation.attacker) === 2) {
        if (Number(formation.defender) === 5) {
            $("ul.formations li").eq(3).addClass("selected");
        } else {
            $("ul.formations li").eq(1).addClass("selected");
        }
    } else if (Number(formation.attacker) === 3 && Number(formation.defender) === 3) {
        $("ul.formations li").eq(2).addClass("selected");
    } else {
        $("ul.formations li").eq(0).addClass("selected");
    }
}

function showError(response) {
    var apiResponse,
        message;

    if (response !== "") {
        if (response instanceof Object) {
            message = apiResponse.errors.message;
        } else {
            try {
                apiResponse = $.parseJSON(response);
                if (apiResponse === "null") {
                    message = i18n.getTranslation('msg_service_error');// 'No se ha podido cargar la información. Intentelo nuevamente';
                } else {
                    message = apiResponse.errors.message;
                }
            } catch(e) {
                message = response;
            }
        }
    } else {
        message = i18n.getTranslation('msg_service_error');;
    }

    $("p.msj-error").text(message);
    $("p.msj-error").show();
    setTimeout(function () { $(".msj-error").hide(); }, 3000);
}

function showSuccess(message) {
    $("p.msj-success").text(message);
    $("p.msj-success").show();
    setTimeout(function () { $(".msj-success").hide(); }, 3000);
}

function timeleft(time) {
    var timeRemaining;
    if ((time - 1440) <= 0) {
        if ((time - 60) > 0) {
            timeRemaining = Utils.sprintf(i18n.getTranslation('txt_remaining_hours'), Math.floor(time / 60)); //"Faltan " + Math.floor(time / 60) + " Horas";
        } else {
            timeRemaining = Utils.sprintf(i18n.getTranslation('txt_remaining_minutes'), time);//"Faltan " + time + " Minutos";
        }
    } else if (time < 2880) {
        timeRemaining = Utils.sprintf(i18n.getTranslation('txt_remaining_day'), Math.floor(time / 1440));//"Falta " + Math.floor(time / 1440) + " Día";
    } else {
        timeRemaining = Utils.sprintf(i18n.getTranslation('txt_remaining_days'), (time > 10080 ? " + " : "") + Math.floor(time / 1440));//"Faltan " + (time > 10080 ? " + " : "") + Math.floor(time / 1440) + " Dias";
    }

    return timeRemaining;
}

function urlTreatment() {
    if (document.location.hash !== "") {
        var miTeamCookie = $.parseJSON(getCookie("players")),
            url = document.location.hash.split("="),
            token,
            id_league_user,
            editFormation;

        switch (url[0]) {
        case "#details":
            // showDetailsLeague($("ul.list li.league a.active").attr("data-idLeague"));
            break;

        case "#edit":
            $(".loading").show();

            if(miTeamCookie[4].league !== "" || miTeamCookie[5].season !== "" ) {

                token = miTeamCookie[3].token;
                initialSetTeamCookie("", "seleccion");
                initialSetTeamCookie(token, "players");
                id_league_user = url[1];

                $.ajax({
                    url: API_URL + "/api/me/seats/" + id_league_user + "/players",
                    timeout: 90000,
                    data: {
                        token: token
                    },
                    dataType: "json",
                    success: function (data, status, xhr) {
                        createListTeamToEdit(data, miTeamCookie, "");
                        createListTeamToEditLyF();
                        editFormation = $.parseJSON(getCookie("players"));
                        createListFormationLyF(editFormation[2]);
                    },
                    error: function (status, type, response) {
                        showError(status.response);
                    },
                    complete: function () {
                        $(".loading").hide();
                    }
                });
            } else {
                location.href = "/mis-equipos.html";
            }

            break;
        }
    }
}

/******** LEAGUES **********/

function showLeagues() {
    if (!SINGLE_TOURNAMENT){
        $("div.container-details").hide();
        $("div.container-liga").show();
    }
}

function createLeague(leagues, link) {
    var listOfLeagues = "",
        timeRemaining,
        disable;

    $.each(leagues, function (index, value) {
        timeRemaining = timeleft(value.start_on);

        if (link !== "") {
            disable = (value.active_league == false ? "disable" : "");
            listOfLeagues += '<li class="league-' + value.id_tournament + ' league ' + disable + '"><a data-time-on="' + timeRemaining + '" data-idSeason="' + value.id_season + '" href="#details"><span class="icon">&nbsp;</span><span class="container"><span class="name">' + value.description + '</span><span class="remaining">' + timeRemaining + '</span></span></a></li>';
        } else {
            listOfLeagues += '<li data-idLeague="' + value.id_league + '" class="league-' + value.id_tournament + ' league" data-idSeason="' +  value.id_season+ '"><span class="icon">&nbsp;</span><span class="container"><span class="name">' + value.tournament + '</span><span class="remaining"></span></span></li>';
        }
    });
    return listOfLeagues;
}

function loadLeagues() {
    $(".loading").show();
    var singleTournament = null;

    $.ajax({
        url: API_URL + "/api/tournaments",
        dataType: "json",
        success: function (leagues) {
            if (!SINGLE_TOURNAMENT) {
                var listOfLeagues = createLeague(leagues, 1);
                $("ul#teams").empty();
                $("ul#teams").append(listOfLeagues);
            }else {
                if (leagues.length ){
                    singleTournament = leagues.shift();
                    showDetailsLeague(singleTournament.id_season, timeleft(singleTournament.start_on));
                }
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function showDetailsLeague(idLeague, timeRemaining) {
    $("body.league p.msj-error").hide();

    var matches = "",
        urlAjax = API_URL + "/api/leagues/";

    $.ajax({
        type : "GET",
        data: { "season": idLeague},
        url : urlAjax,
        dataType: "json",
        success: function (eventos) {

            $("p.current-date").text(Utils.sprintf(i18n.getTranslation('txt_games_this_week'), eventos.tournament));            

            $.each(eventos.events, function (index, value) {
                matches += "<li>" + value.home + " vs " + value.away + "</li>";
            });

            $(".container-details ul.list").empty();

            var league = new Array(eventos),
                link = "",
                formatLeague = createLeague(league, link);

            $(".container-details ul.list").append(formatLeague);
            $("ul.matches").empty();
            $("ul.matches").append(matches);
            $("div.container-liga").hide();
            $("div.container-details").show();
            setCookie('current_day_number', eventos.current_day_number, 1000);
        },
        error: function (status, type, response) {
            $(".loading").css("display", "none");
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
            ga('send', 'pageview', '/ligas/detalle/' + idLeague + '.html');
            $("div.container-details ul.list li .container span.remaining").html(timeRemaining);
        }
    });

}

/******** PLAYERS **********/

function getPlayerPoints(element, id_league_user, id_player) {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        description = "",
        token = miTeamCookie[3].token,
        playerId = element.attr("data-idp");

    ga('send', 'pageview', '/ver-equipo/' + id_league_user + '/jugador/' + playerId);

    $.ajax({
        type: "GET",
        url: API_URL + "/api/me/seats/" + id_league_user + "/players/" + playerId + "/incidents",
        data: { "token": token },
        dataType: "json",
        success: function (incidents) {
            $.each(incidents, function (index, value) {
                description += "<span>" + value.description + ": " + value.points + "</span>";
            });
            element.parent("li").children("p.player-details").append(description);
            element.addClass("fulled");
        },
        error: function (status, type, response) {
            if (status.status === 404) {
                element.parent("li").children("p.player-details").append("<span>" + i18n.getTranslation('txt_player_no_points') + "</span>");
                element.addClass("fulled");
            } else {
                showError(status.response);
            }
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function playersClubCount(miPlayer, playerIdClub) {
    var players = miPlayer.split(",").clean(""),
        contador = "",
        playerData;

    $.each(players, function (index, value) {
        playerData = players[index].split(":");
        if (playerData[4] === playerIdClub) {
            contador++;
        }
    });
    return contador;
}

function changeListByIdClubAdd(playerIdClub) {
    $.each($("ul.to-select li.player-plus a"), function (index, value) {
        if ($(value).attr("data-idClub") === playerIdClub && !$(value).parent("li").hasClass("player-minus")) {
            $(value).parent("li.player-plus").removeClass("player-plus").addClass("player-cancel");
        }
    });
}

function changeListByIdClubRemove(playerIdClub) {
    $.each($("ul.to-select li.player-cancel a"), function (index, value) {
        if ($(value).attr("data-idClub") === playerIdClub) {
            $(value).parent("li.player-cancel").removeClass("player-cancel").addClass("player-plus");
            $(value).removeClass("cancel").addClass("plus");
        }
    });
}

function countOccurrenceIdClub(players, playerObj) {
    var count = 0,
        playersList = players.split(","),
        idclub;

    $.each(playersList, function (index, value) {
        idclub = playersList[index].split(":");
        if (idclub === playerObj.attr("data-idClub")) {
            count++;
        }
    });
    return count;
}

function addPlayer(playerObj) {
    var playerId = playerObj.attr("data-idp"),
        playerPosition = playerObj.attr("data-pos"),
        playerName = playerObj.attr("data-name"),
        playerClub = playerObj.attr("data-club"),
        playerIdClub = playerObj.attr("data-idClub"),
        miTeamCookie = $.parseJSON(getCookie("seleccion")),
        miPlayer = miTeamCookie[1].miPlayers,
        playerForClubCount = 0,
        positionCount,
        maxPlayerAllow,
        currentPlayerSelected;

    playerForClubCount = playersClubCount(miPlayer, playerIdClub);

    if (miTeamCookie[0][playerPosition] < miTeamCookie[2][playerPosition] && playerForClubCount < maxPlayerAllowGeneral) {
        positionCount = ++miTeamCookie[0][playerPosition];
        maxPlayerAllow = parseInt(miTeamCookie[2][playerPosition], 10);
        miTeamCookie[1].miPlayers +=  playerPosition + ":" + playerId + ":" + playerName + ":" + playerClub + ":" + playerIdClub + ",";

        miTeamCookie = JSON.stringify(miTeamCookie);
        setCookie("seleccion", miTeamCookie, 1000);

        playerObj.removeClass("plus");
        playerObj.addClass("minus");
        playerObj.parent("li").addClass("player-minus").removeClass("player-plus");

        $('.count-selected').text(positionCount);

        if (positionCount === maxPlayerAllow) {
            window.scrollTo(0, 0);
            $(".player-plus").hide();
            $(".btn-filters").hide();
            $(".player-cancel").hide();
        }
    }

    if (playerForClubCount >= maxPlayerAllowGeneral - 1) {
        changeListByIdClubAdd(playerIdClub);
        playerForClubCount = 0;
    }
}

function removePlayer(playerObj, teamCookie) {
    var miTeamCookie = $.parseJSON(getCookie(teamCookie)),
        players = miTeamCookie[1].miPlayers,
        playerToRemove = playerObj.attr("data-pos") + ":" + playerObj.attr("data-idp") + ":" + playerObj.attr("data-name") + ":" + playerObj.attr("data-club") + ":" + playerObj.attr("data-idClub") + ",",
        positionCount,
        maxPlayerAllow,
        currentPlayerSelected,
        playerIdClub,
        idClubCount;

    players = players.replace(playerToRemove, "");

    $.each(miTeamCookie[0], function (index, value) {
        if (index === playerObj.attr("data-pos")) {

            value--;
            miTeamCookie[0][index] = value;
            miTeamCookie[1].miPlayers = players;

            positionCount = miTeamCookie[0][index];
            maxPlayerAllow = miTeamCookie[2][index];

            miTeamCookie = JSON.stringify(miTeamCookie);
            setCookie(teamCookie, miTeamCookie, 1000);
            playerObj.parent("li").removeClass("player-minus").addClass("player-plus");
            currentPlayerSelected = parseInt($(".count-selected").text(), 10) - 1;
            $('.count-selected').text(currentPlayerSelected);

            if (positionCount < maxPlayerAllow) {
                $(".player-plus").show();
                $(".btn-filters").show();
                $(".player-cancel").show();
            }
        }
    });

    playerIdClub = playerObj.attr("data-idClub");
    idClubCount = countOccurrenceIdClub(players, playerObj);

    if (idClubCount === 0) {
        changeListByIdClubRemove(playerIdClub);
    }
}

function formatPlayer(player, action) {
    var dataPlayer = [],
        shortPosition;

    dataPlayer.position = player[0];
    dataPlayer.id_player = player[1];
    dataPlayer.full_name = player[2];
    dataPlayer.home = player[3];
    dataPlayer.id_entry = player[4];
    dataPlayer.id_home = player[4];

    shortPosition = shortNamePosition(dataPlayer.position);
    if (action !== "minus") {
        action = "plus";
    }

    return createPlayerRow(dataPlayer, action, shortPosition);
}

function createListSelectPlayerJson(listPlayers, formation, position, events) {
    var listOfPlayers = "",
        miTeamCookie,
        playersAlreadySelected,
        playersAlreadyId = [],
        playersClubCount = [],
        player,
        idPlayer,
        action,
        shortPosition;

    if (events === "") {
        setCookie("seleccion", getCookie("players"), 1000);
    }

    miTeamCookie = $.parseJSON(getCookie("seleccion"));
    playersAlreadySelected = miTeamCookie[1].miPlayers.split(",").clean("");
    $.each(playersAlreadySelected, function (index, value) {
        player = value.split(":");
        if (player[0] === position) {
            playersAlreadyId.push(player[1]);
        }
        playersClubCount[player[4]] = ++playersClubCount[player[4]] || 1;
    });

    $.each(listPlayers, function (index, value) {
        if (listPlayers[index].position === position) {
            idPlayer = listPlayers[index].id_player;
            action = "";
            shortPosition = shortNamePosition(listPlayers[index].position);

            // flag para cuando crea la lista selecciona su estado activo, seleccionado, inactivo
            if (playersAlreadyId.indexOf(idPlayer) !== -1) {
                action = "minus";
            } else {
                if (playersClubCount[listPlayers[index].id_entry] === maxPlayerAllowGeneral) {
                    action = "cancel";
                } else {
                    action = "plus";
                }
            }

            listOfPlayers += createPlayerRow(listPlayers[index], action, shortPosition);
        }
    });

    $("#players").html("<ul class='players-list to-select'>" + listOfPlayers + '</ul><a class="btn-back-team" href="javascript:void(0);">' + i18n.getTranslation('btn_save_selection') + '</a>');
}

function createListSelectPlayer(listPlayersCookie) {
    var listPlayers = listPlayersCookie[1].miPlayers.split(","),
        formation = listPlayersCookie[2],
        playerCount = [],
        listOf = [],
        player,
        action,
        replace,
        shortPosition,
        difference,
        i,
        listOfPlayers = "";


    playerCount.goalkeeper = 0;
    playerCount.defender = 0;
    playerCount.midfielder = 0;
    playerCount.attacker = 0;
    playerCount.manager = 0;

    listOf.goalkeeper = "";
    listOf.defender = "";
    listOf.midfielder = "";
    listOf.attacker = "";
    listOf.manager = "";


    $.each(listPlayers, function (index, value) {
        player = listPlayers[index].split(":");
        action = "minus";
        if (player[0] !== "") {
            if ((playerCount[player[0]] < formation[player[0]]) && player[0] !== "goalkeeper" && player[0] !== "manager") {
                listOf[player[0]] += formatPlayer(player, action);
                playerCount[player[0]]++;
            } else if (player[0] === "goalkeeper" || player[0] === "manager") {

                listOf[player[0]] += formatPlayer(player, action);
                playerCount[player[0]] = 1;
            } else {

                replace = listPlayers[index] + ',';
                listPlayersCookie[0][player[0]] = listPlayersCookie[0][player[0]] - 1;
                listPlayersCookie[1].miPlayers = listPlayersCookie[1].miPlayers.replace(replace, "");
            }
        }
    });

    $.each(formation, function (index, value) {
        shortPosition = shortNamePosition(index);
        difference = formation[index] - playerCount[index];
        if (difference > 0) {
            for (i = 1; i <= difference; i++) {
            	text = ( index == "manager" ) ? i18n.getTranslation('txt_select_mgr') : i18n.getTranslation('txt_select_player');
                listOf[index] += '<li class="player-plus ' + index + '"><a data-pos="' + index + '" href="#" class="ic-choose plus"><span class="rol">' + shortPosition + '</span><span class="player-name">' + text + '</span><span class="ic-arrow">&nbsp;</span></a></li>';
            }
        }
    });

    listOfPlayers = '<ul class="mi-team players-list">' + listOf.goalkeeper + listOf.defender + listOf.midfielder + listOf.attacker + listOf.manager + '</ul>';

    listPlayersCookie = JSON.stringify(listPlayersCookie);

    setCookie("players", listPlayersCookie, 1000);

    $(".mi-team").remove();
    $(listOfPlayers).insertAfter(".formations");
}

/*-------- partidos -------*/
/*function loadMatch(contiendas, time_week) {
    var listOfMatchOpen = '',
        listOfMatchClose = '';
    $.each(contiendas.seats, function (index, value) {

        var time = timeleft(value.start_on),
            statusClass = "";
        // if (value.status = "open") {
        //   listOfMatchOpen += '<li><a class="match ic-arrow">' + value.name + '<span>&nbsp;</span></a><div class="team-options"><p>Comienza en ' + time + '</p><a data-idLeague="' + value.id_league + '" data-idSeason="' + value.id_season + '" data-id-league-user="' + value.id_league_user + '" class="btn btn-team-edit" href="#">Editar Equipo</a></div></li>';
        // } else if (value.status === "closed") {
        //   if (value.is_winner === 1) {
        //     statusClass = "winner";
        //   } else {
        //     statusClass = "normal";
        //   }

        //   listOfMatchClose += '<li class="' + statusClass + '"><a class="match ic-arrow">' + value.name + ' (Cerrada)<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>Cerrada</p><p>Posición: ' + value.position + '</p><p>Puntos: ' + value.points + '</p><a class="btn btn-team-edit" href="/ver-equipo.html#equipo=' + value.id_league_user + '">Ver Equipo</a></div></li>';
        // }

        if (time_week === "current_week") {
        	if ( value.status == "open" ) {
        		listOfMatchOpen += '<li><a class="match ic-arrow">' + value.name + '<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user+ '</p><p>' + time + '</p><a data-idLeague="' + value.id_league + '" data-idSeason="' + value.id_season + '" data-id-league-user="' + value.id_league_user + '" class="btn btn-team-edit" href="#">' + i18n.getTranslation('txt_team_edit') + '</a></div></li>';
        	} else if ( value.status == "close" ) {
        		listOfMatchOpen += '<li class="normal"><span class="match-points-right">' + value.points + ' pts</span><a class="match ic-arrow">' + value.name + ' <span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + i18n.getTranslation('txt_Puntos') + ': ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">' + i18n.getTranslation('txt_show_team') + '</a></div></li>';
        	} else {
        		listOfMatchOpen += '<li class="normal"><span class="match-points-right">' + i18n.getTranslation('txt_in_game') + '</span><a class="match ic-arrow">' + value.name + ' <span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + i18n.getTranslation('txt_Puntos') + ': ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">' + i18n.getTranslation('txt_show_team') + '</a></div></li>';
        	}
        } else {
        	if ( value.status == "open" ) {
        		listOfMatchClose += '<li><a class="match ic-arrow">' + value.name + '<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + time + '</p><a data-idLeague="' + value.id_league + '" data-idSeason="' + value.id_season + '" data-id-league-user="' + value.id_league_user + '" class="btn btn-team-edit" href="#">' + i18n.getTranslation('txt_team_edit') + '</a></div></li>';
        	} else if ( value.status == "close" ) { 
        		// listOfMatchClose += '<li class="normal"><a class="match ic-arrow">' + value.name + ' (' + value.points + ' puntos)<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>Puntos: ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">Ver Equipo</a></div></li>';
        		listOfMatchClose += '<li class="normal"><span class="match-points-right">' + value.points + ' pts</span><a class="match ic-arrow">' + value.name + '<span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + i18n.getTranslation('txt_Puntos') + ': ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">' + i18n.getTranslation('txt_show_team') + '</a></div></li>';
        	} else {
        		listOfMatchClose += '<li class="normal"><span class="match-points-right">' + i18n.getTranslation('txt_in_game') + '</span><a class="match ic-arrow">' + value.name + ' <span>&nbsp;</span></a><div class="team-info team-options"><p>ID: ' + value.id_league_user + '</p><p>' + i18n.getTranslation('txt_Puntos') + ': ' + value.points + '</p><a class="btn" href="/ver-equipo.html#equipo=' + value.id_league_user + '">' + i18n.getTranslation('txt_show_team') + '</a></div></li>';
        	}
        }
    });

    $(".loading").hide();
    if (contiendas.seats.length == 0) {
    	listOfMatchOpen = listOfMatchClose = "<li>No tienes equipos creados</li>"; 
    }
    
    if (time_week === "current_week") {
        $('.current-week-match .teams-container').html(listOfMatchOpen);
    } else if (time_week === "last_week") {
        $('.last-week-match .teams-container').html(listOfMatchClose);
    } else if (time_week === "next_week") {
        $('.next-week-match .teams-container').html(listOfMatchClose);
    }
    
}*/

function createFilters(matches) {
    var filters = "";
    $.each(matches, function (index, value) {
        filters += '<li class="plus"><a href="#" data-event="' + value.id_event + '"><span class="filter-match"><span>' + value.home + '</span> vs <span>' + value.away + '</span> </span><span class="ic-arrow"></span></a></li>';
    });

    if (filters !== "") {
        $(".filter-list").empty();
        $(".filter-list").append(filters);
    }
}

function callMatches(idSeason) {
    var urlAjax = API_URL + "/api/leagues/";
    $(".loading").show();
    $.ajax({
        type: 'GET',
        url: urlAjax,
        data: {"season": idSeason},
        dataType: "json",
        success: function (filtros) {
            window.scrollTo(0, 0);
            if (idSeason !== "") {
                createFilters(filtros.events);
                location.hash="filter";
                $("#players").toggle();
                $("#filters").toggle();
                $("span.text-title").empty().text(i18n.getTranslation('txt_filter_by_game'));
                $(".count-rol").toggle();
                $("body").toggleClass("show-msj filter-msj");
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
            ga('send', 'pageview', '/equipo/filtrar-partidos.html');
        }
    });
}

function callPlayersFiltersLyF() {
    $("#players").toggle();
    $("#filters").toggle();
    $(".count-rol").toggle();
    $("body").toggleClass("show-msj filter-msj");
    $("span.text-title").empty().text(i18n.getTranslation('txt_select_players'));
}

function callPlayersLyF(playerPosition, positionLimit) {
    location.hash = 'seleccion';
    $(".page-title span.text-title").text(i18n.getTranslation('txt_select_players'));
    var nombrePlayerPosition = "--";
    switch (playerPosition) {
    case "goalkeeper":
        nombrePlayerPosition = i18n.getTranslation('txt_goalkeeper_lbl');
        break;
    case "defender":
        nombrePlayerPosition = i18n.getTranslation('txt_defender_lbl');
        break;
    case "midfielder":
        nombrePlayerPosition = i18n.getTranslation('txt_midfielder_lbl');
        break;
    case "attacker":
        nombrePlayerPosition = i18n.getTranslation('txt_attacker_lbl');
        break;
    case "manager":
        nombrePlayerPosition = i18n.getTranslation('txt_manager_lbl');
        break;
    }

    $("p.count-rol .rol").text(nombrePlayerPosition).attr("position", playerPosition);
    $('.btn-done, .btn-edit-team').toggle();
    // $('.formations').toggle();
    $("#subtitle").toggle();

    $('body').addClass('show-msj');
    // $("h1.page-title a.ic-title").attr("class", "btn-back-general").attr("href", "/crear-equipo.html");
    $('.mi-team').toggle();
    $('#players').toggle();
    $('.count-rol').attr('class', 'count-rol ' + playerPosition).toggle();
    
    $('a.ic-choose.plus span.rol').text();
    $('.count-selected').text(positionLimit[0][playerPosition]);
    $('.maximum-number').text(positionLimit[2][playerPosition]);
}

function callPlayers(playerPosition, events) {
    $(".loading").show();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        id_league = miTeamCookie[4].league,
        urlAjax = API_URL + "/api/leagues/" + id_league + "/events/players/q?",
        formation;

    $.ajax({
        type : "GET",
        data: {
            "position": playerPosition,
            "events": events,
            "offset": 0,
            "limit": 200
        },
        url : urlAjax,
        dataType: "json",
        success: function (data) {
            window.scrollTo(0, 0);
            formation = miTeamCookie[2];
            createListSelectPlayerJson(data, formation, playerPosition, events);
            if (events === "") {
                $(".mi-team li a").addClass("ic-choose");
                callPlayersLyF(playerPosition, miTeamCookie);
            } else {                
                window.history.back();
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
            ga('send', 'pageview', '/equipo/seleccionar-jugadores/' + playerPosition + '.html');
        }
    });
}

function callPlayersFilter(filters) {
    var eventsId = [],
        position = $("div.header p span.count-container span.rol").attr("position");

    $.each(filters, function (index, value) {
        eventsId.push($(value).children("a").attr("data-event"));
    });

    callPlayers(position, eventsId);
    $("span.text-title").empty().text(i18n.getTranslation('txt_players_selection'));
}

/*------- creación de ranking -------*/

function createRanking() {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        time = "last_week",
        token = miTeamCookie[3].token,
        userName = miTeamCookie[6].userName,
        userRank = "",
        myRank,
        lastWeekPoints,
        userRankClass,
        occurrenceUser;
    var callbacksCreateRanking = {
        success: function(ranking){
            var res = BuildMarkUp.dayNumberRankings(ranking);
            $('.day-number-list').append(res);
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    };
    dataservice.getDayNumbersRankingsBySeasonId(DEFAULT_SELECTED_SEASON_ID, token, callbacksCreateRanking);
    
    /*$.ajax({
        type : "GET",
        url : API_URL + "/api/me/stats/ranking/q?",
        data: {
            "token": token,
            "time": time
        },
        dataType: "json",
        success: function (ranking) {
            myRank = ranking.my_rank;
            lastWeekPoints = ranking.points;
            userRankClass = "";
            occurrenceUser = 0;

            $.each(ranking.top_ten, function (index, value) {
                if (index < 10) {
                    if (myRank === value.rank) {
                        userRankClass = "current-user";
                        occurrenceUser = 1;
                    } else {
                        userRankClass = "";
                    }
                    userRank += '<li class="' + userRankClass + '"><span class="position">' + value.rank + '</span><span class="user">' + value.nick + '</span><span class="points">' + value.points + '</span></li>';
                }
            });

            if (occurrenceUser === 0) {
                userRank += '<li class="current-user"><span class="position">' + myRank + '</span><span class="user">' + userName + '</span><span class="points">' + lastWeekPoints + '</span></li>';
            }

            $("ul.user-list").append(userRank);
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });*/
}

/* creacion de la lista de jugadores que se ejecuta cada ves que se carga crear-equipos.html */
function initialFormation() {
    $("#main-content").show();
    var listPlayersCookie = $.parseJSON(getCookie("players")),
        formation = listPlayersCookie[2];

    createListSelectPlayer(listPlayersCookie);
    createListFormationLyF(formation);
}

var createDayNumberHeader = function(){
    //Quick solution, will be removed on future frontend reengineering
  var miTeamCookie = $.parseJSON(getCookie("players")),
      token = miTeamCookie[3].token,
      url = document.location.hash.split("="),
      id_league_user = url[1];

  $.ajax({
    url: API_URL + "/api/me/seats/" + id_league_user,
    timeout: 90000,
    data: {
        token: token
    },
    dataType: "json",
    success: function (data, status, xhr) {
      if (data && data[0] && data[0].day_number){
        //Render de cabecera de dayNumber
        var currentDayNumber = i18n.getTranslation('lbl_round_' + data[0].day_number);
        $('#subtitle-round').text( currentDayNumber?currentDayNumber : 'Fecha actual' );
      }
    }
  });
};

/* funciones que manejan el look and feel */

function showPlayersSelectionLyF() {
    $("#players").toggle();
    $(".mi-team").show();
    $(".btn-filters").show();
    $('.btn-done, .btn-edit-team').toggle();
    $("body").removeClass('show-msj');
    $(".count-rol").toggle();
    // $(".formations").toggle();
    $("#subtitle").toggle();

}

function myTeamsWeek(token, time) {
    var apiResponse;
    var showMoreButton = false;
    $(".loading").show();
    $.ajax({
        type: "GET",
        url: API_URL + "/api/me/seats/q",

        data: {
            "token": token,
            "offset": 0,
            "limit": paginationResultPerPage + 1,
            "time": time
        },
        dataType: "json",
        success: function (contiendas) {

            hideMoreButton = contiendas.seats.length < (paginationResultPerPage + 1);
            if ( !hideMoreButton) {
                $('.' + time).find('.paginator').show();
                contiendas.seats.pop();
                $('.' + time).paginator(token, {
                    offset: paginationResultPerPage,
                    time: time,
                    paginationResultPerPage: paginationResultPerPage
                });
            }
            
            BuildMarkUp.loadMatch(contiendas, time);

        },
        error: function (status, type, response) {
            if (status.status !== 404) {
                if (time !== "last_week") {
                    showError(status.response);
                } else {
                    if (status.response !== "") {
                        apiResponse = $.parseJSON(status.response);
                        $(".last-week-match .msj-error").text(apiResponse.errors.message);
                    } else {
                        $(".last-week-match .msj-error").text(i18n.getTranslation('msg_service_error'));
                    }
                }
            } else {
                $('.'+time+ ' .teams-container').html('<li class="normal"><a class="match ic-arrow" href="#">' + i18n.getTranslation('txt_no_teams') + '</a></li>');
            	/*if ( time == "next_week") {
            		$(".next-week-match .teams-container").html('<li class="normal"><a class="match ic-arrow" href="#">' + i18n.getTranslation('txt_no_teams') + '</a></li>');
            	} else if ( time == "current_week") {
            		$(".current-week-match .teams-container").html('<li class="normal"><a class="match ic-arrow" href="#">' + i18n.getTranslation('txt_no_teams') + '</a></li>');
            	} else {
            		$(".last-week-match .teams-container").html('<li class="normal"><a class="match ic-arrow" href="#">' + i18n.getTranslation('txt_no_teams') + '</a></li>');
            	}*/
            }
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function statsWeek(token) {
    $(".loading").show();

    var headCurrent,
        headLast;

    myTeamsWeek(token, "current_week");
    myTeamsWeek(token, "last_week");
    myTeamsWeek(token, "next_week");
    $.ajax({
        type: "GET",
        url: API_URL + "/api/stats",
        data: {"token": token},
        dataType: "json",
        success: function (user) {
            headCurrent = '<p class="week-date"><span></span></p>';
            headLast = '<p class="week-date"><span>' + Utils.sprintf(i18n.getTranslation('txt_sum_points'), user.last_week_points) + '</span></p>';

            $(".current-week-match .stats").html(headCurrent);
            $(".last-week-match .stats").html(headLast);
            $(".next-week-match .stats").html(headCurrent);
        },
        error: function (status, type, response) {
            if (status === 404) {
                showError(status.response);
            }
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

/*------- EQUIPO --------*/

function saveTeam(miPlayers, formation, id_league, token) {

    var playersId = [];
    $.each(miPlayers, function (index, value) {
        var playerData = value.split(":");
        playersId.push(playerData[1]);
    });

    ga('send', 'pageview', '/guardar-equipo');
    $(".loading").show();
    $.ajax({
        type : "POST",
        data: {
            "id_league": id_league,
            "formation": formation,
            "players": playersId,
            "token": token
        },
        url: API_URL + "/api/me/seats",
        dataType: "json",
        success: function (response) {
            if (response !== "") {
                if (response.errors !== undefined){
                    showError(response.errors.message);
                } else {
                    initialSetTeamCookie("", "seleccion");
                    initialSetTeamCookie(token, "players");
                    location.href = "/exito.html";
                }
            } else {
                location.href = "/error.html";
            }
        },
        error: function (status, type, response) {
        	var json = $.parseJSON(status.response);
        	if ( json.errors.code === 1011 ) {
    			location.href = "/suscripcion.html#create-team";
        	} 
        	else {
        		showError(status.response);	
        	}
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function editTeam(miPlayers, formation, id_league, id_league_user, token) {
    var playersId = [];
    $.each(miPlayers, function (index, value) {
        var playerData = value.split(":");
        playersId.push(playerData[1]);
    });

    $(".loading").show();
    ga('send', 'pageview', '/actualizar-equipo/id_league/' + id_league + '/id_league_user/' + id_league_user);

    $.ajax({
        type : "POST",
        data: {
            "id_league": id_league,
            "id_league_user": id_league_user,
            "formation": formation,
            "players": playersId,
            "token": token
        },
        url: API_URL + "/api/me/seats/" + id_league_user,
        dataType: "json",
        success: function (response) {
            if (response !== "") {
                if (response.errors !== undefined){
                    showError(response);
                } else {
                    initialSetTeamCookie("", "seleccion");
                    initialSetTeamCookie(token, "players");
                    location.href = "/mis-equipos";
                }
            } else {
                location.href = "/error.html";
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function verifySubscription() {
    $(".loading").show();

    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token,
        urlAjax = API_URL + "/api/me/subscriptions";

    $.ajax({
        type : "GET",
        data: {
            "token": token
        },
        url : urlAjax,
        dataType: "json",
        success: function (response) {
            if (response.subscribed === true) {
                location.replace("#subscription-on");
                location.reload();
            } else {
                location.replace("#subscription-off");
                location.reload();
            }
            // $("#user-nick").val(response.nick);
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

/*---- login -----*/

function sendLogin(celNumber, personalPass, action) {
    $('.loading').show();

    $.ajax({
        type : "POST",
        data: {
            "ani": celNumber,
            "pin": personalPass
        },
        url: "/login.php",
        dataType: "json",
        success: function (response) {
            var miTeamCookie,
                miPlayers,
                token = response.token,
                id_league,
                formation,
                teamCookie;

            if (token !== "") {
                if (action === "saveTeam") {

                    miTeamCookie = $.parseJSON(getCookie("players"));

                    miPlayers = miTeamCookie[1].miPlayers.split(",").clean("");
                    id_league = miTeamCookie[4].league;
                    formation = miTeamCookie[0].defender + "-" + miTeamCookie[0].midfielder + "-" + miTeamCookie[0].attacker;

                    miTeamCookie[3].token = token;
                    miTeamCookie = JSON.stringify(miTeamCookie);
                    setCookie("players", miTeamCookie, 1000);

                    saveTeam(miPlayers, formation, id_league, token);

                } else {
                    teamCookie = '[{"goalkeeper":"0","defender":"0","midfielder":"0","attacker":"0","manager":"0"}, {"miPlayers":""}, {"goalkeeper":1, "defender":4, "midfielder":3, "attacker":3, "manager":1}, {"token":"' + token + '"}, {"league":""}, {"season":""}, {"userName":""}]';

                    setCookie("players", teamCookie, 1000);

                    location.href = "/home.html";
                }
            } else {
                showError(response);
            }
        },
        error: function (status, type, response) {
            showError(status.response);
            $('.loading').hide();
        }
    });
}

function backButtonCel() {
    if (window.history && window.history.pushState) {

        $(window).on('popstate', function () {
            var hashLocation = location.hash,
                hashSplit = hashLocation.split("#!/"),
                hashName = hashSplit[1],
                hash;

            if (hashName !== '') {
                hash = window.location.hash;
                if (hash === '') {
                    showLeagues();
                    document.location.hash = "";
                }
            }
        });
        //window.history.pushState('forward', null, './#forward');
    }
}

function setUser(miTeamCookie) {
    var token = miTeamCookie[3].token;

    $.ajax({
        type : "GET",
        data: {
            "token": token
        },
        url: API_URL + "/api/me",
        dataType: "json",
        success: function (user) {
            miTeamCookie[6].userName = user.nick;
            miTeamCookie = JSON.stringify(miTeamCookie);
            setCookie("players", miTeamCookie, 1000);
            $("a.btn-play").css("display", "block");
        },
        error: function (status, type, response) {
            $(".btn-play").attr("href", "/ligas.html");
            $(".btn-play").addClass("btn-play-liga");
            $(".btn-play").css("display", "block");
            $(".login").css("display", "block");
            miTeamCookie[3].token = "";
            miTeamCookie = JSON.stringify(miTeamCookie);
            setCookie("players", miTeamCookie, 1000);
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function homeUserData(userData) {
    var miTeamCookie = $.parseJSON(getCookie("players"));
    miTeamCookie[6].userName = userData.nick;
    miTeamCookie = JSON.stringify(miTeamCookie);

    setCookie("players", miTeamCookie, 1000);

    // current week
    $("body.home div.current-week span.user-name").text(userData.nick);
    // $("body.home div.current-week p.user-points span").text(userData.current_week_points);
    // $("body.home div.current-week p.user-ranking span").text(userData.current_week_rank);
    // $("body.home div.current-week p.user-win span").text(userData.current_week_wins);
    $("body.home div.current-week p.teams-created span.teams-quantity").text(userData.current_week_teams_created);
    $("body.home div.current-week p.teams-created span.team-text").text( (userData.current_week_teams_created == 1) ? i18n.getTranslation('msg_team_created') : i18n.getTranslation('msg_teams_created'));
    
    // last week
    $("body.home div.last-week p.user-ranking span.user-rank").text(userData.last_week_rank);
    $("body.home div.last-week p.user-ranking span.user-points").text(userData.last_week_points);
    $("body.home div.last-week p.user-winner span.user-nick").text(userData.last_week_winner);
    $("body.home div.last-week p.user-winner span.user-points").text(userData.last_week_winner_points);

    if ( userData.subscribed === false ) {
    	$(".banner").show();
    }
}

function getUserStats(token) {
    $.ajax({
        type: "GET",
        data: {
            "token": token
        },
        url: API_URL + "/api/me/stats",
        dataType: "json",
        success: function (userData) {
            homeUserData(userData);
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

/*--------- PRIZE --------*/

function addPrizeLyF(prize) {
    var imgPrize = "";
    $.each(prize, function (index, value) {
        imgPrize += '<li><img src="' + prize.url + '" alt="premio "></li>';
    });
    $("ul.awards-image").append(imgPrize);
}

function callPrizes() {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token;

    $.ajax({
        type : "GET",
        data: {
            "token": token
        },
        url: API_URL + "/api/contents/prize",
        dataType: "json",
        success: function (prize) {
            if (prize !== "") {
                addPrizeLyF(prize);
            } else {
                location.href = "/error.html";
            }
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

function showTeam() {
    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token,
        url = document.location.hash.split("="),
        id_league_user = url[1];

    initialSetTeamCookie("", "seleccion");
    initialSetTeamCookie(token, "players");

    $.ajax({
        url: API_URL + "/api/me/seats/" + id_league_user,
        timeout: 90000,
        data: {
            token: token
        },
        dataType: "json",
        success: function (data, status, xhr) {
            if (data instanceof Array && data[0] !== undefined) {
                $(".header-top").html(
                    "<p" + ((data[0].is_winner) ? ' class="winner">' : '>') + "<span>ID " + id_league_user + "</span>" + data[0].name + "<span>" + i18n.getTranslation('txt_total_points') + ": " + data[0].points + "</span></p>"
                );
            }
        }
    });

    $.ajax({
        url: API_URL + "/api/me/seats/" + id_league_user + "/players",
        timeout: 90000,
        data: {
            token: token
        },
        dataType: "json",
        success: function (data, status, xhr) {
            createListTeamToEdit(data, miTeamCookie, "see-team");

        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
}

/* suscripcion */
function suscription(token) {

    // suscribo al usuario
   $("#suscribe").click(function() {
    	$(".loading").show();
    	$.ajax({
            type : "POST",
            data: { "token": token },
            url : API_URL + "/api/me/subscriptions/subscribe",
            dataType: "json",
            success: function (subscriptionId, status, xhr) {
            	if ( document.location.hash === "#create-team" ) {
                    miTeamCookie = $.parseJSON(getCookie("players"));

                    miPlayers = miTeamCookie[1].miPlayers.split(",").clean("");
                    id_league = miTeamCookie[4].league;
                    formation = miTeamCookie[0].defender + "-" + miTeamCookie[0].midfielder + "-" + miTeamCookie[0].attacker;

                    miTeamCookie[3].token = token;
                    miTeamCookie = JSON.stringify(miTeamCookie);
                    setCookie("players", miTeamCookie, 1000);

                    saveTeam(miPlayers, formation, id_league, token);
                }
            	else {
            		location.href = "/exito.html" + document.location.hash;
            	}
                
            },
            error: function (status, type, response) {
                showError(status.response);
            },
            complete: function () {
                $(".loading").hide();
            }
        });

    })
}


var callbacksUserTeamByEvent = function(){
    var $loading = $('.loading');
    return {
      success: function (results) {
          if ((paginationResultPerPage+1 > results.length)){
            $('.my-teams-by-event .paginator').hide();
          }else {
            $('.my-teams-by-event .paginator').show();
            results.pop();
          }
          var teamListEl = BuildMarkUp.teamsByEvent(results);
          $('.teamsByEvent').append(teamListEl);
      },
      error: function (status, type, response) {
            if (status.status !== 404) {
                if (options.time !== "last_week") {
                    showError(status.response);
                } else {
                }
            } else {
            }
            $('.my-teams-by-event .paginator').hide();
      },
      complete: function(){
        $loading.hide();
      }
    }
}
var applyBindings = function(){
  var myTeamsPaginatorCounter = 0; 
  var $selectedSeasonId = $('[data-selected-seasonid]');
  var $selectedDayNumber = $('[data-selected-daynumber]');
  var $selectedOffset = $('[data-selected-offset]');
  var $selectedPhase = $('[data-selected-phase]');
  var $selectedRound = $('[data-selected-round]');

  $('.events').on('click', '.event-enabled', function (e) {
    e.preventDefault();
    $('.teamsByEvent').empty();
    $('.my-teams-by-event').show();
    myTeamsPaginatorCounter = 0;
    
    $selectedPhase.attr('data-selected-phase', $(this).attr('data-phase'));
    $selectedRound.attr('data-selected-round', $(this).attr('data-round'));
    var eventData = {phase: $selectedPhase.attr('data-selected-phase'), round: $selectedRound.attr('data-selected-round')};
    var teamListHeaderEl = BuildMarkUp.teamsByEventHeader(eventData);
    $('.teamsByEventHeader').empty().append(teamListHeaderEl);

    fetchMyTeamEventsCreated($(this).attr('data-day-number'), DEFAULT_SELECTED_SEASON_ID, callbacksUserTeamByEvent(), 0);

    $selectedSeasonId.attr('data-selected-seasonid',DEFAULT_SELECTED_SEASON_ID);
    $selectedDayNumber.attr('data-selected-daynumber', $(this).attr('data-day-number'));
    $selectedOffset.attr('data-selected-offset', 0 );
  });

  $('.my-teams-by-event').on('click', '.paginator', (function() {  
        return function(e) {
            e.preventDefault();
            var eventData = {phase: $selectedPhase.attr('data-selected-phase'), round: $selectedRound.attr('data-selected-round')};           
            var teamListHeaderEl = BuildMarkUp.teamsByEventHeader(eventData);
            $('.teamsByEventHeader').empty().append(teamListHeaderEl);
            myTeamsPaginatorCounter += paginationResultPerPage;
            fetchMyTeamEventsCreated($selectedDayNumber.attr('data-selected-daynumber'), $selectedSeasonId.attr('data-selected-seasonid'), callbacksUserTeamByEvent(), myTeamsPaginatorCounter, true);
            
        };
  })());

  $('.day-number-list').on('click', '.day-number-item', function(e){
    $(this).toggleClass('selected-day');
    e.stopPropagation();
    $(this).find('.day-number-ranking').toggle();
  });

  $('.menu .build-team').click(function(){
    initialSetTeamCookie("", "seleccion");  
    initialSetTeamCookie(token, "players");
  });
};

var fetchMyTeamEventsCreated = function(day_number, seasonId, callbacks, count, skip){
    var $loading = $('.loading');
    $('.events').hide();
    
    dataservice.getMyTeamsByEvent(day_number, seasonId, callbacks, count);
    if (!skip){
      location.hash = 'teams';    
    }
};

var loadMyTeamEventsCreated = function(token){
  var $loading = $('.loading');
  $loading.show();
  var callbacks = {
    success: function (results) {
      var res = BuildMarkUp.teamEvents(results);
      $('.events').append(res);
    },
    error: function (status, type, response) {
        $(".msj-error").show();
        setTimeout(function () { $(".msj-error").hide(); }, 3000);
    },
    complete: function(){
      $loading.hide();
    }
  };
  dataservice.getMyTeamEventsCreated(token, null, callbacks);
};

document.addEventListener("DOMContentLoaded", function(event) {
  i18n.translate($('body'));
  includeHeader();
  urlTreatment();
  applyBindings();
});

$(document).on("click", "ul.players-list-edit li a.ic-choose", function (e) {
    e.preventDefault();
    if ($(this).hasClass("fulled")) {
        $(this).parent("li").toggleClass("active");
    } else {
        $(".loading").show();
        $(this).parent("li").toggleClass("active");
        var url = document.location.hash.split("="),
            id_league_user = url[1];

        getPlayerPoints($(this), id_league_user);
    }
});

$(document).on("click", "ul.list li:not(.disable).league a", function (e) {
    e.preventDefault();
    $("body").addClass("active-league");
    $("ul.list li a.active").removeClass("active");
    $(this).addClass("active");
    $(".loading").show();
    showDetailsLeague($(this).attr("data-idSeason"), $(this).attr("data-time-on"));

});

$(document).on("click", "ul.weeks li a.show-week", function (e) {
	$(".weeks li.selected").removeClass("selected");
    $(this).parent("li").toggleClass("selected");

    $("div.last-week-match").hide();
    if ($(this).hasClass("show-last-week")) $("div.last-week-match").show();
    
    $("div.current-week-match").hide();
    if ($(this).hasClass("show-current-week")) $("div.current-week-match").show();
    
    $("div.next-week-match").hide();
    if ($(this).hasClass("show-next-week")) $("div.next-week-match").show();
});

/*$(document).on("click", "ul.weeks li a.show-week", function (e) {
    e.preventDefault();
    if (!$(this).parent("li").hasClass("selected")) {
        $(".weeks li.selected").removeClass("selected");
        $(this).parent("li").toggleClass("selected");
        $("div.last-week-match").toggle();
        $("div.current-week-match").toggle();
        $("div.next-week-match").toggle();

        if ($(this).hasClass("show-last-week")) 
        {
            if ($(".last-week-error").text() !== "") 
            {
                $(".last-week-match .msj-error").show();
            }
        } else if ($(this).hasClass("show-current-week")) {
            $(".last-week-error").hide();
        } else if ($(this).hasClass("show-next-week")) {
        	$(".next-week-error").hide();
        }
    }
});*/

/* funcionalidades para los filtros */
$(document).on("click", ".btn-filters", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players"));
    callMatches(miTeamCookie[5].season);
    $("body").addClass("filtros");
    $(".msj-filtro").hide();
});

$(document).on("click", "#filters .filter-list li a", function (e) {
    e.preventDefault();
    if ($(this).parent("li").hasClass("minus")) {
        $(this).parent("li").toggleClass("plus minus");
    } else {
        $(this).parent("li").toggleClass("minus plus");
    }
});

$(document).on("click", "a.apply-filter", function (e) {
    e.preventDefault();
    if ($("ul.filter-list li.minus").length > 0) {
        callPlayersFilter($("ul.filter-list li.minus"));
    } else {
        $(".msj-filtro").show();
    }
});

$(document).on("click", ".btn-done", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        totalPlayers = parseInt(miTeamCookie[0].goalkeeper, 10) + parseInt(miTeamCookie[0].defender, 10) + parseInt(miTeamCookie[0].midfielder, 10) + parseInt(miTeamCookie[0].attacker, 10) + parseInt(miTeamCookie[0].manager, 10),
        miPlayers = miTeamCookie[1].miPlayers.split(",").clean(""),
        token = miTeamCookie[3].token,
        id_league = miTeamCookie[4].league,
        formation = $("ul.formations li.selected a").text();

    if (totalPlayers === 12 && token !== "") {
        saveTeam(miPlayers, formation, id_league, token);
    } else if (totalPlayers !== 12) {
        $(".msj-error").show();
        setTimeout(function () { $(".msj-error").hide(); }, 3000);
    } else {
        location.href = "/perfil.html#login";
    }
});


$(document).on("click", '.formations li a', function (e) {
    e.preventDefault();
    var formationId = $(this).attr('data-id'),
        listOfPlayers = $('.mi-team li'),
        currentFormation = $.parseJSON(getCookie("players")),
        listPlayersCookie;

    $('.formations li.selected').removeClass('selected');
    $(this).parent('li').toggleClass("selected");
    $('.mi-team li.hide').removeClass('hide');

    switch (formationId) {
    case '1':
        $.each(listOfPlayers, function (index, value) {
            if (index === 5 || index === 9 || index === 13) {
                value.className += ' hide';
            }
        });
        currentFormation[2].goalkeeper = 1;
        currentFormation[2].defender = 4;
        currentFormation[2].midfielder = 3;
        currentFormation[2].attacker = 3;

        break;

    case '2':
        $.each(listOfPlayers, function (index, value) {
            if (index === 5 || index === 12) {
                value.className += ' hide';
            }
        });
        currentFormation[2].goalkeeper = 1;
        currentFormation[2].defender = 4;
        currentFormation[2].midfielder = 4;
        currentFormation[2].attacker = 2;

        break;

    case '3':
        $.each(listOfPlayers, function (index, value) {
            if (index === 4 || index === 5) {
                value.className += ' hide';
            }
        });
        currentFormation[2].goalkeeper = 1;
        currentFormation[2].defender = 3;
        currentFormation[2].midfielder = 4;
        currentFormation[2].attacker = 3;

        break;

    case '4':
        $.each(listOfPlayers, function (index, value) {
            if (index === 9 || index === 12) {
                value.className += ' hide';
            }
        });
        currentFormation[2].goalkeeper = 1;
        currentFormation[2].defender = 5;
        currentFormation[2].midfielder = 3;
        currentFormation[2].attacker = 2;

        break;
    }
    currentFormation = JSON.stringify(currentFormation);
    setCookie("players", currentFormation, 1000);

    listPlayersCookie = $.parseJSON(getCookie("players"));
    createListSelectPlayer(listPlayersCookie);
});

$(document).on("click", '.mi-team li a.ic-choose', function (e) {
    e.preventDefault();
    var playerPosition = $(this).attr('data-pos'),
        events,
        listPlayersCookie;

    if ($(this).hasClass("minus")) {

        $(this).removeClass("minus").addClass("plus");
        $(this).addClass("plus");
        removePlayer($(this), "players");

        listPlayersCookie = $.parseJSON(getCookie("players"));
        createListSelectPlayer(listPlayersCookie);
    } else {
        events = "";
        $(".mi-team li a").removeClass("ic-choose");
        $("body").addClass("bk-create-team");
        callPlayers(playerPosition, events);            
    }
});

/* boton seleccion de jugador llamado de ajax a los jugadores */
$(document).on("click", '.to-select li a.ic-choose', function (e) {
    e.preventDefault();

    if ($(this).hasClass("plus")) {
        addPlayer($(this));
    } else if ($(this).hasClass("minus")) {
        $(this).removeClass("minus");
        $(this).addClass("plus");
        removePlayer($(this), "seleccion");
    }
});

/* boton para volver a creacion de equipo */
$(document).on("click", '.btn-back-team', function (e) {
    e.preventDefault();
    setCookie("players", getCookie("seleccion"), 1000);
    var listPlayersCookie = $.parseJSON(getCookie("players"));

    window.scrollTo(0, 0);
    createListSelectPlayer(listPlayersCookie);
    showPlayersSelectionLyF();
    if ($("body").hasClass("editar-team")) {
        $("span.text-title").empty().text(i18n.getTranslation('txt_edit_team'));
    } else {
        $("span.text-title").empty().text(i18n.getTranslation('txt_create_team'));
    }
    $("body").removeClass("bk-create-team");
    window.history.back();
});

$(document).on("click", "a.btn-team-edit", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players"));

    miTeamCookie[4].league = $(this).attr("data-idLeague");
    miTeamCookie[5].season = $(this).attr("data-idSeason");
    miTeamCookie = JSON.stringify(miTeamCookie);
    setCookie("players", miTeamCookie, 1000);
    location.href = "/editar-equipo.html#edit=" + $(this).attr("data-id-league-user");
});

$(document).on("click", "a.btn-edit-team", function (e) {
    e.preventDefault();

    var miTeamCookie = $.parseJSON(getCookie("players")),
        totalPlayers = parseInt(miTeamCookie[0].goalkeeper, 10) + parseInt(miTeamCookie[0].defender, 10) + parseInt(miTeamCookie[0].midfielder, 10) + parseInt(miTeamCookie[0].attacker, 10) + parseInt(miTeamCookie[0].manager, 10),
        miPlayers = miTeamCookie[1].miPlayers.split(",").clean(""),
        token = miTeamCookie[3].token,
        id_league = miTeamCookie[4].league,
        formation = $("ul.formations li.selected a").text(),
        url = document.location.hash.split("="),
        id_league_user = url[1];

    if (totalPlayers === 12 && token !== "") {
        editTeam(miPlayers, formation, miTeamCookie[4].league, id_league_user, token);
    } else if (totalPlayers !== 12) {
        $(".msj-error").show();
        setTimeout(function () { $(".msj-error").hide(); }, 3000);
    } else {
        location.href = "/perfil.html#login";
    }
});

$(document).on("click", "a.btn-confirm-league", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players"));
    miTeamCookie[4].league = $(".container-details ul.list li.league").attr("data-idLeague");
    miTeamCookie[5].season = $(".container-details ul.list li.league").attr("data-idSeason");
    miTeamCookie = JSON.stringify(miTeamCookie);
    setCookie("players", miTeamCookie, 1000);
    location.href = "/crear-equipo.html";
});

function crearEquipoInit()
{
    
    // toma los datos de la liga seleccionada
    var miTeamCookie = $.parseJSON(getCookie("players"));
    var id_league = miTeamCookie[4].league;
    var id_season = miTeamCookie[5].season;

    
    // si selecciono torneo está todo ok.
    if ( id_league && id_season )
    {
        var miTeamCookie = $.parseJSON(getCookie("players"));
        miTeamCookie[4].league = id_league
        miTeamCookie[5].season = id_season;
        miTeamCookie = JSON.stringify(miTeamCookie);
        setCookie("players", miTeamCookie, 1000);
        
        initialFormation();
        var currentDayNumber = i18n.getTranslation('lbl_round_' + getCookie("current_day_number"));
        $('#subtitle-round').text( currentDayNumber?currentDayNumber : 'Fecha actual' );
    }
    else // si no selecciono torneo se carga el default.
    {
        $(".loading").show();

        var miTeamCookie = $.parseJSON(getCookie("players"));
        initialSetTeamCookie("", "seleccion");
        initialSetTeamCookie(miTeamCookie[3].token, "players");

        var id_season = "";
        var remain = "";
        var show_create_team = false;
        
        $.ajax({
            url: API_URL + "/api/tournaments",
            dataType: "json",
            success: function (leagues) {

                $.each(leagues, function(index, value) {
                    // si encontre la liga argentina y está habilitada cargo la vista crear equipo
                    if ( (typeof DEFAULT_SELECTED_SEASON_ID != 'undefined') && 
                         value.id_season == DEFAULT_SELECTED_SEASON_ID &&
                         value.active_league == true) {
                        id_season = value.id_season;
                        show_create_team = true;

                        return false;
                    }
                });
                
                if (show_create_team == true)
                {
                    $.ajax({
                        type : "GET",
                        data: { "season": id_season},
                        url : API_URL + "/api/leagues/",
                        dataType: "json",
                        success: function (league) {

                            var miTeamCookie = $.parseJSON(getCookie("players"));
                            miTeamCookie[4].league = league.id_league
                            miTeamCookie[5].season = id_season;
                            miTeamCookie = JSON.stringify(miTeamCookie);
                            setCookie("players", miTeamCookie, 1000);
                            setCookie('current_day_number', league.current_day_number, 1000);
                            var currentDayNumber = i18n.getTranslation('lbl_round_' + getCookie("current_day_number"));
                            $('#subtitle-round').text( currentDayNumber?currentDayNumber : 'Fecha actual' );


                            
                            // location.href = "/crear-equipo.html";
                            initialFormation();
                            return false;
                        },
                        error: function() {
                            location.href = "/ligas.html";
                        },
                        complete: function() {
                            $(".loading").hide();
                        }
                    });
                }
                else
                {
                    location.href = "/ligas.html";
                }
            },
            error: function() {
                location.href = "/ligas.html";
            }
        });     
    }

}
/*------- Edicion de usuario -------*/

$(document).on("click", "body.subscription-page a.btn-edit-user", function (e) {
    e.preventDefault();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        newNick = $(this).siblings("input.input-sub-on").val(),
        token = miTeamCookie[3].token;

    if (newNick !== "") {
        $(".loading").show();
        $.ajax({
            type: "POST",
            url: API_URL + "/api/me/",
            data: {"token": token, "nick": newNick},
            dataType: "json",
            success: function (response) {
//
            },
            error: function (status, type, response) {
                showError(status.response);
            },
            complete: function () {
                $(".loading").hide();
            }
        });
    } else {
        showError(i18n.getTranslation('txt_name_field_incomplete'));
    }
});

/*------ envio de informacion por las paginas de suscripcion ------*/
$(document).on("click", "a.login-user", function (e) {
    e.preventDefault();
    var celNumberLine = $('.cel-number').val().toString(),
        celNumberPrefix = $('.cel-number-prefix').val().toString(),
        personalPass = $(".personal-pass").val(),
        messageError = i18n.getTranslation('txt_error_entrada_telefono'),
        miTeamCookie = $.parseJSON(getCookie("players")),
        miPlayers,
        action = "";

    if (getCookie("players") !== null) {
        miPlayers = miTeamCookie[1].miPlayers.split(",").clean("");
        if (miPlayers.length > 0) {
            action = "saveTeam";
        }
    }

    celNumber = celNumberPrefix + celNumberLine;

    if (/^([0-9])*$/.test(celNumber) && celNumberPrefix.length !== 0 && celNumberLine.length !== 0 && personalPass.length !== 0) {
        sendLogin(celNumber, personalPass, action);
    } else {
        $("#login .msj-error").text(messageError).show();
        setTimeout(function () { $("#login .msj-error").hide(); }, 3000);
    }

});

$(document).on("click", "a.send-pass-sms", function (e) {
    e.preventDefault();
    location.hash = "send-pwd-sms";
    location.reload();
});

$(document).on("click", "a.send-sms", function (e) {
    e.preventDefault();
    var ani = $("input.input-sms").val().toString();
    var aniPrefix = $("input.input-sms-prefix").val().toString();
    var $msjError = $(this).siblings('.msj-error'); 

    $msjError.hide();

    $("input.input-sms")
    var pinValidationRegex = new RegExp(PIN_VALIDATION_REGEX,"g");
    var lineNumber = aniPrefix + ani;

    if (ani.length && aniPrefix.length && pinValidationRegex.test(lineNumber)) {
        $.ajax({
            type: "POST",
            url: API_URL + "/api/me/pin/reset/",
            data: {
                "ani": lineNumber
            },
            dataType: "json",
            success: function () {
                $('.loading').hide();
                location.hash = "login";
                location.reload();
            },
            error: function (status, type, response) {
                $('.loading').hide();
                showError(status.response);
            },
            complete: function () {
                $('.loading').hide();
            }
        });
    } else {
        $msjError.text(i18n.getTranslation('msg_invalid_phone_number')).show();
        setTimeout(function () { $msjError.hide(); }, 3000);
    }

});

$(document).on("click", "a.btn-back", function (e) {
    window.history.back();
});

/*------- suscripcion --------*/

/*------ subcribirse --------*/
$(document).on("click", "a.activate-subscription", function (e) {
    e.preventDefault();
    ga('send', 'pageview', '/perfil.html#btn-activar-subscripcion');
    $(".loading").show();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token;

    $.ajax({
        type : "POST",
        data: { "token": token},
        url : API_URL + "/api/me/subscriptions/subscribe",
        dataType: "json",
        success: function (subscriptionId, status, xhr) {
            location.href = "/exito.html#suscribe";
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
});

/*------ desubcribirse --------*/

$(document).on("click", "a.deactivate-subscription", function (e) {
    e.preventDefault();
    ga('send', 'pageview', '/perfil.html#btn-desactivar-subscripcion');
    $(".loading").show();
    var miTeamCookie = $.parseJSON(getCookie("players")),
        token = miTeamCookie[3].token;

    $.ajax({
        type : "POST",
        data: { "token": token},
        url : API_URL + "/api/me/subscriptions/unsubscribe",
        dataType: "json",
        success: function (subscriptionId, status, xhr) {
            location.hash = "subscription-off";
            location.reload();
        },
        error: function (status, type, response) {
            showError(status.response);
        },
        complete: function () {
            $(".loading").hide();
        }
    });
});

/*----- COMPLEMENTOS -----*/
window.onhashchange = function() { 
    /* esto se ejecuta cuando se vuelve de jugadores a seleccionar a crea tu equipo*/
    if ($("body").hasClass("bk-create-team") && !(location.hash === '#seleccion' || location.hash === '#filter')) {
        $("body").removeClass("bk-create-team");
        createListSelectPlayer($.parseJSON(getCookie("players")));
        showPlayersSelectionLyF();
        if ($("body").hasClass("editar-team")) {
            $("span.text-title").empty().text(i18n.getTranslation('txt_edit_team'));
        } else {
            $("span.text-title").empty().text(i18n.getTranslation('txt_create_team'));
        }
    }
    /* esto se ejecuta cuando se vuelve de filtros a seleccion de lista de jugadores a seleccionar */
    if ($("body").hasClass("filtros") && location.hash !== '#filter') {
        $("#players").show();
        $("p.count-rol").show();
        $("#filters").hide();
        $("body").removeClass("filtros").addClass("bk-create-team");
        $("body").toggleClass("show-msj filter-msj");
        $("body").removeClass("filtros filter-msj").addClass("bk-create-team show-msj");
        $("span.text-title").empty().text(i18n.getTranslation('txt_select_players'));
    }

    //returns from mis-equipos#teams to mis-equipos
    if ( document.location.pathname === '/mis-equipos.html' &&  document.location.hash != '#teams'){
      $('.my-teams-by-event').hide();
      $('.events').show();
    }
    
    /* esto se ejecuta cuando se vuelve de reset pin */
    if ($("body").hasClass("profile") && location.hash === '#login') { 
    	location.reload();
    }
}

$(document).on("click", ".history-back", function (e) {
    e.preventDefault();
    if (($("body").hasClass("subscription-perfil") || $("body").hasClass("home")) && $(this).text() !== i18n.getTranslation('txt_volver')) {
        if ($("#subscription").hasClass("active")) {
            window.history.back();
        }
    } else if ($("body").hasClass("league")) {
        if (!$("body.league").hasClass("active-league")) {
            var miTeamCookie = $.parseJSON(getCookie("players")),
                token = miTeamCookie[3]["token"] || "";
            location.href = (token === "")? "/index.html" : "/home.html";
        } else {
            $("body.active-league").removeClass("active-league");
            location.reload();
        }
    } else {
        window.history.back();
    }
});

/* banner */
$(document).on("click", ".banner", function (e) {
    e.preventDefault();
    ga('send', 'pageview', '/suscripcion.html');
    
    location.href = "suscripcion.html#suscribe";
});

