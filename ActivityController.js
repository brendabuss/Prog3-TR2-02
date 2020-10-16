class ActivityController{
    //contrutor da classe pega os ids coloca nos elementos forms e tabela
    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        //chamar métodos dos botões de form e tabela
        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onSubmit(){
        //método pro envio de dados do formulário pra criar nova atividade
        this.formEl.addEventListener("submit", event => {
            //parar o envio padrão
            event.preventDefault();
            //pega o botão Adicionar do form pelo tipo submit
            let btn = this.formEl.querySelector("[type=submit]");
            //desabilita o botão enquanto envia o form pra não dar caca
            btn.disabled = true;
            //pega os dados do form
            let values = this.getValues(this.formEl);
            //senão houver dados, retorna false 
            if (!values) return false;
            //salva os dados
            values.save();
            //add a linha 
            this.addLine(values);
            //limpa o form
            this.formEl.reset();
            //disponibiliza botão Adicionar pra próximo envio
            btn.disabled = false;

        });

    }

    onEdit(){
        //método pro envio de dados editados do formulário editar atividade

        //se clicar no cancelar do formulário de update, trocar pro formulário de nova atividade
        document.querySelector("#box-activity-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });

        //se houver submit em Editar
        this.formUpdateEl.addEventListener("submit", event => {
            //parar o envio padrão
            event.preventDefault();
            //mapear o botão de envio do form update
            let btn = this.formUpdateEl.querySelector("[type=submit]");
            //desabilitar pra impedir que seja clicado várias vezes durante o envio
            btn.disabled = true;
            //pega os valores alterados do form passando form update como parametro
            let values = this.getValues(this.formUpdateEl);
            //pegar indice da linha 
            let index = this.formUpdateEl.dataset.trIndex;
            //pegar a linha a partir do indice
            let tr = this.tableEl.rows[index];
            //criar variavel pra alocar os dados da linha anteriormente salvos
            let activityOld = JSON.parse(tr.dataset.activity);
            //copiar valores anteriormente inseridos, com os novos em um novo objeto
            let result = Object.assign({}, activityOld, values);
            //criar novo objeto de Atividade
            let activity = new Activity();
            //receber resultados 
            activity.loadFromJSON(result);
            //salvar novo objeto de atividade
            activity.save();
            //repassar objeto para a linha da tabela
            this.getTr(activity, tr);
            //chamar atualizador de quantidade de atividades
            this.updateCount();
            //limpar formulário do update
            this.formUpdateEl.reset();
            //habilitar o botão de envio novamente
            btn.disabled = false;
            //deixar vísivel formulário de Nova Atividade
            this.showPanelCreate();

        });
    }


    getValues(formEl){
        //pegar valores do form, cria-se um array vazio pra receber as infos e boolean pra cancelar o envio se necessário
        let activity = {};
        let isValid = true;
        //passar pelos campos com spread
        [...formEl.elements].forEach(function (field, index) {
            //os campos name e description não podem ser passados vazios
            if (['name', 'description'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add('has-error');
                isValid = false;

            }
            //atribui valor dos campos a atividade
            activity[field.name] = field.value;

        });

        if (!isValid) {
            return false;
        }
        //retornar objeto de atividade com dados capturados
        return new Activity(
            activity.name,
            activity.date,
            activity.time,
            activity.description
        );

    }

    selectAll(){
        //pega as atividades do localStorage pra carregar na tabela 
        let activities = Activity.getActivitiesStorage();

        activities.forEach(dataActivity=>{

            let activity = new Activity();

            activity.loadFromJSON(dataActivity);

            this.addLine(activity);

        });

    }

    addLine(dataActivity) {
        //adiciona linhas com os dados na tabela e atualiza o número de registros
        let tr = this.getTr(dataActivity);

        this.tableEl.appendChild(tr);

        this.updateCount();

    }

    getTr(dataActivity, tr = null){
        //cria a linha da tabela usando os dados
        if (tr === null) tr = document.createElement('tr');

        tr.dataset.activity = JSON.stringify(dataActivity);

        tr.innerHTML = `
            <td class="sorting_1">${dataActivity.id}</td>
            <td>${dataActivity.name}</td>
            <td>${Utils.dateFormat(dataActivity.date)}</td>
            <td>${dataActivity.time}</td>
            <td>${dataActivity.description}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        return tr;

    }

    addEventsTr(tr){
        //adicionar ações de click aos botões

        //botão de excluir
        tr.querySelector(".btn-delete").addEventListener("click", e => {

            if (confirm("Deseja realmente excluir?")) {

                let activity = new Activity();

                activity.loadFromJSON(JSON.parse(tr.dataset.activity));

                activity.remove();

                tr.remove();

                this.updateCount();

            }

        });

        //botão de editar
        tr.querySelector(".btn-edit").addEventListener("click", e => {
            let json = JSON.parse(tr.dataset.activity);
            //pegar qual das linhas o editar foi clicado
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {
                //pega os names das chaves do JSON e converte para os inputs que precisam ser iguais em name
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {
                    //tratar campo de data de maneira diferente
                    switch (field.type) {
                        //converte em data e a classe Utils devolve o value em String
                        case 'date':
                            let dateForm = new Date(json[name]);
                            field.value = Utils.dateInputFormat(dateForm);
                            break;

                        default:
                            field.value = json[name];

                    }
                }
            }      
            //após passar pelos campos mostra o form
            this.showPanelUpdate();
        });

    }

    showPanelCreate(){
        //mostra formulário criar nova atividade
        document.querySelector("#box-activity-create").style.display = "block";
        document.querySelector("#box-activity-update").style.display = "none";

    }

    showPanelUpdate() {
        //mostra formulário editar atividade  
        document.querySelector("#box-activity-create").style.display = "none";
        document.querySelector("#box-activity-update").style.display = "block";

    }

    updateCount(){
        //atualiza quantidade de registros no card info
        let numberActivities = 0;

        //percorre a coleção da tabela com spread
        [...this.tableEl.children].forEach(tr =>{
            numberActivities++;

            //let activity = JSON.parse(tr.dataset.activity);
        });

        //setar número no card
        document.querySelector("#number-activities").innerHTML = numberActivities;
    }

}