class Utils {
    //esta classe serve apenas pra formatar a data em String
    static dateFormat(date){

        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();

    }
    //este metodo foi feito pra formatar o valor do input date: YYYY-MM-DD
    static dateInputFormat(date){

        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

    }

}