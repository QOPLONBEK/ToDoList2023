const totalMark = 150
const PERCENT = 100;
const lowMark = 40

const addZero = function(number){
    return number < 10 ?"0" + number : number
}

const showDate = function(dateString){
    const date = new Date(dateString);
    return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${addZero(date.getFullYear())} ${date.getHours()}:${date.getMinutes()}`
}

const studentsTemplate = document.querySelector("#student-template")

const studentsFormName = document.querySelector("#edit-name")
const studentsFormLastname = document.querySelector("#edit-lastname")
const studentsFormMark = document.querySelector("#edit-mark")
const studentEditBtn = document.querySelectorAll(".student-edit")
const studentFilter = document.querySelector(".filter")

// students.map(item => console.log(item.id))
// studentFilter.addEventListener('click', function(evt){
//     evt.preventDefault();


// })

// studentEditBtn.forEach(item => {
//     console.log(item);
// })

const renderStudent = function(student){

    const {id, name, lastname, markedDate, mark} = student;

    const studentsTable = studentsTemplate.content.cloneNode(true);
    studentsTable.querySelector(".student-id").textContent = id;
    studentsTable.querySelector(".student-name").textContent = `${name} ${lastname}`;
    studentsTable.querySelector(".student-marked-date").textContent = showDate(markedDate);
    
    const markPercent = Math.floor(mark * PERCENT / totalMark)
    
    studentsTable.querySelector(".student-mark").textContent = markPercent + "%";

    const studentEditBtn = studentsTable.querySelector(".student-edit")
    const studentDelBtn = studentsTable.querySelector(".student-delete")
    // console.log(studentEditBtn);

    const status = studentsTable.querySelector(".student-pass-status")

    if(markPercent >= lowMark){
        status.textContent = "PASS"
        status.classList.add("text-success")
    }
    else if(markPercent < lowMark){
        status.textContent = "FAIL" 
        status.classList.add("text-danger")
    }

    return studentsTable
}

const studentsTableBody = document.querySelector("#students-table-body");
const count = document.querySelector('.count')
const middleValue = document.querySelector('.text-end')

const middleValueArr = []
function middleValueMark(studentsItem){
    studentsItem.forEach(item => {
        middleValueArr.push(Math.floor(item.mark * PERCENT / totalMark))
    })
    if(studentsItem.length > 0){
        middleValue.textContent = `Average mark: ${Math.floor(middleValueArr.reduce((   a,b)=> a + b) / middleValueArr.length)}%`
    }
}

// console.log(students.length);
const renderStudents = function(){
    studentsTableBody.innerHTML = ""
    const studentsFragment = document.createDocumentFragment();
    students.forEach(student =>{
        const studentsTable = renderStudent(student);
        studentsFragment.append(studentsTable);
    })
    studentsTableBody.append(studentsFragment);
}

studentFilter.addEventListener('submit', function(evt){
    evt.preventDefault();
    studentsTableBody.innerHTML = ""
    // console.log(evt.target[0].value);
    function renderFilteredStudent(){
        filterArr.filter(item => {
            const filterTable = renderStudent(item) 
            filterFragment.append(filterTable)
        })
    }
    let filterArr = []
    const filterFragment = document.createDocumentFragment();
    if(evt.target[1].value == '' && evt.target[2].value == '') {
        renderFilteredStudent()
    }
    // else if()
    console.log(filterArr);
    let filteredStudents = students.filter(item => {
        if(evt.target[1].value <= (item.mark * PERCENT / totalMark) &&  evt.target[2].value >= (item.mark * PERCENT / totalMark)){
            filterArr.push(item)
            // return
        }
        else if(item.name.toLowerCase().includes(evt.target[0].value.trim().toLowerCase()) || evt.target[1].value <= (item.mark * PERCENT / totalMark) &&  evt.target[2].value >= (item.mark * PERCENT / totalMark)){

            filterArr.push(item)
        }
    })
    // filterArr.filter(item => {
    //     const filterTable = renderStudent(item) 
    //     filterFragment.append(filterTable)
        
    // })
    if(evt.target[3].value == 1){
        // studentsTableBody.innerHTML = ""
        filterArr = filterArr.sort((a,b) => a.name.localeCompare(b.name))
        renderFilteredStudent()
    }
    else if(evt.target[3].value == 2){
        filterArr = filterArr.sort((a,b) => b.mark - a.mark)
        renderFilteredStudent()
    }
    else if(evt.target[3].value == 3){
        filterArr = filterArr.sort((a,b) => a.mark - b.mark)
        renderFilteredStudent()
    }


    middleValueMark(filterArr)
    count.textContent = `count: ${filterArr.length}`
    studentsTableBody.append(filterFragment)
    
})

count.textContent = `count: ${students.length}`
const addForm = document.querySelector("#add-form");
const addStudentModal = document.querySelector("#add-student-modal");
const addStudentElModal = new bootstrap.Modal(addStudentModal)
middleValueMark(students)

addForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    const nameValue = e.target[0].value;
    const lastNameValue = e.target[1].value;
    const markValue = e.target[2].value;
    
    if(nameValue && lastNameValue && markValue){
        const newStudent = {
            id: Math.floor(Math.random() * 1000),
            name: nameValue,
            lastname: lastNameValue,
            mark: markValue,
            markedDate: new Date()
        }
        studentEditBtn.forEach(item => {
            item.id = newStudent.id
            console.log(item);
        })
        students.push(newStudent)
        localStorage.setItem('students', JSON.stringify(students))
    }
    renderStudents();
    e.target.reset();
    addStudentElModal.hide();
    middleValueMark(students)
    
})

renderStudents();