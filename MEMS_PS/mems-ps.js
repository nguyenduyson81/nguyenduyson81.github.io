function isPmaxGood(alpha) {
    return alpha >= 0 && alpha <= 1e6;
    // unit of Pmax is kPa, smaller than 1e6
}

function isThicknessGood(alpha) {
    return alpha >= 0 && alpha <= 10;
    // unit of thickness is millimeter
}

function isDiaphragmGood(beta) {
    return beta >= 0 && beta <= 50;
    // unit of thickness is millimeter
}

function isHWGelGood(alpha) {
    return alpha >= 0 && alpha <= 50;
    // unit ofcm
}

function isaGood(a) {
    return a >= 0 && a <= 30;
    // unit of thickness is millimeter
}

function istGood(t) {
    return t >= 0 && t <= 200;
    // unit of thickness is micrometer
}

function calResult(Pmax, h_steel, R_steel, H_gel, W_gel, a_MEMS, t_MEMS) {
    if (!h_steel || !R_steel || !a_MEMS || !t_MEMS) {
        return null;
    }

    if (isThicknessGood(h_steel) && isDiaphragmGood(R_steel) && isaGood(a_MEMS) && istGood(t_MEMS)) {
        var w0_steel, w0_MEMS, P0_MEMS, P_MEMS

        E_steel = 197e9; // Young's modulus of S
        v_steel = 0.27;

        E_Si = 169e9; // Young's modulus of Silicon 
        v_Si = 0.0064; // Poision's ratio
        // Change the unit
        h_steel = h_steel * 1e-3;
        R_steel = R_steel * 1e-3;
        a_MEMS = a_MEMS * 1e-3;
        t_MEMS = t_MEMS * 1e-6;
        H_gel = H_gel * 1e-2;
        W_gel = W_gel * 1e-2;

        D_MEMS = E_Si * (t_MEMS ** 3) / 12 / (1 - v_Si ** 2);
        D_steel = E_steel * (h_steel ** 3) / 12 / (1 - v_steel ** 2);

        P_MEMS = Pmax * 1.38 * D_MEMS / D_steel * (R_steel / a_MEMS) ** 6;
        P_MEMS = Math.round(P_MEMS * 10) / 10;

        w0_steel = 1e6 * Pmax * (R_steel ** 4) / 64 / D_steel;
        w0_MEMS = 0.115 * w0_steel * (R_steel / a_MEMS) ** 2

        w0_steel = Math.round(w0_steel * 100) / 100;
        w0_MEMS = Math.round(w0_MEMS * 100) / 100;
        P0_MEMS = 1000 * H_gel * 9.81 / 1e3;
        P0_MEMS = Math.round(P0_MEMS * 10) / 10;

        return [w0_steel, P0_MEMS, P_MEMS, w0_MEMS]
    }
    
    return 'Sorry, try again with different inputs!'
}

$(document).ready(function () {
    $('#param-Pmax').bind('keyup mouseup', function () {
        $(this).attr('class', '');
        const Pmax = $(this).val();
        if (!Pmax) {
            $(this).addClass('ugly');
        } else if (isPmaxGood(Pmax)) {
            $(this).addClass('good');
        } else {
            $(this).addClass('bad');
        }
    });

    $('#param-alpha').bind('keyup mouseup', function () {
        $(this).attr('class', '');
        const alpha = $(this).val();
        if (!alpha) {
            $(this).addClass('ugly');
        } else if (isThicknessGood(alpha)) {
            $(this).addClass('good');
        } else {
            $(this).addClass('bad');
        }
    });

    $('#param-beta').bind('keyup mouseup', function () {
        $(this).attr('class', '');
        const beta = $(this).val();
        if (!beta) {
            $(this).addClass('weird');
        } else if (isDiaphragmGood(beta)) {
            $(this).addClass('good');
        } else {
            $(this).addClass('bad');
        }
    });

    $('#param-a').bind('keyup mouseup', function () {
        $(this).attr('class', '');
        const a = $(this).val();
        if (!a) {
            $(this).addClass('ugly');
        } else if (isaGood(a)) {
            $(this).addClass('good');
        } else {
            $(this).addClass('bad');
        }
    });

    $('#param-t').bind('keyup mouseup', function () {
        $(this).attr('class', '');
        const t = $(this).val();
        if (!t) {
            $(this).addClass('ugly');
        } else if (istGood(t)) {
            $(this).addClass('good');
        } else {
            $(this).addClass('bad');
        }
    });

    $('#param-H_gel').bind('keyup mouseup', function () {
        $(this).attr('class', '');
        const t = $(this).val();
        if (!t) {
            $(this).addClass('ugly');
        } else if (isHWGelGood(t)) {
            $(this).addClass('good');
        } else {
            $(this).addClass('bad');
        }
    });

    $('#param-W_gel').bind('keyup mouseup', function () {
        $(this).attr('class', '');
        const t = $(this).val();
        if (!t) {
            $(this).addClass('ugly');
        } else if (isHWGelGood(t)) {
            $(this).addClass('good');
        } else {
            $(this).addClass('bad');
        }
    });

    $('input').bind('keyup mouseup', function () {
        const [result1, result2, result3, w0_MEMS] = calResult($('#param-Pmax').val(), $('#param-alpha').val(), $('#param-beta').val(), $('#param-H_gel').val(), $('#param-W_gel').val(), $('#param-a').val(), $('#param-t').val());
        $('#result1').text(result1);
        $('#result2').text(result2);
        $('#result3').text(result3);
        $('#w0_MEMS').text(w0_MEMS);
    });
});