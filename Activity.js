class Activity{
    //construtor da classe
    constructor(name, date, time, description){
        this._id;
        this._name = name;
        this._date = date;
        this._time = time;
        this._description = description;

    }

    //getters
    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get date(){
        return this._date;
    }

    get time(){
        return this._time;
    }

    get description(){
        return this._description;
    }

    loadFromJSON(json){
        //carregar JSON usando as chaves names
        for (let name in json){
            
            switch(name){
                case '_date':
                    this[name] = new Date(json[name]);
                break;
                default:
                    this[name] = json[name];

            }
        }
    }

    static getActivitiesStorage() {
        //se não houver registro no localStorage, traz array vazio
        let activities = [];
        //senão faz parse dos registros encontrados
        if (localStorage.getItem("activities")) {

            activities = JSON.parse(localStorage.getItem("activities"));

        }

        return activities;

    }

    getNewID(){
        //pegar IDs das atividades do localStorage
        let activitiesID = parseInt(localStorage.getItem("activitiesID"));
        //se activitiesID não for maior que zero é preciso atribuir o primeiro ID
        if (!activitiesID > 0) activitiesID = 0;

        activitiesID++;

        localStorage.setItem("activitiesID", activitiesID);

        return activitiesID;

    }


    save(){
        //método salvar
        //pegar atividades do localStorage
        let activities = Activity.getActivitiesStorage();

        //se o ID for maior que zero percorre registros e se for id igual é edição, senão cria ID
        if (this.id > 0) {
            
            activities.map(a=>{

                if (a._id == this.id) {

                    Object.assign(a, this);

                }

                return a;

            });

        } else {

            this._id = this.getNewID();

            activities.push(this);

        }
        //salva no localStorage
        localStorage.setItem("activities", JSON.stringify(activities));

    }

    remove(){
        //método remover
        //pegar registros do localStorage e jogar num array
        let activities = Activity.getActivitiesStorage();

        //percorre o array e remove o elemento onde o id for igual
        activities.forEach((activityData, index)=>{

            if (this._id == activityData._id) {

                activities.splice(index, 1);

            }

        });

        localStorage.setItem("activities", JSON.stringify(activities));

    }



}