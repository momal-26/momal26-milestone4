interface Resume {  
    name: string;  
    email: string;  
    phone: string;  
    experience: string[];  
    education: string[];  
    skills: string[];  
}  

let resume: Resume = {  
    name: '',  
    email: '',  
    phone: '',  
    experience: [],  
    education: [],  
    skills: []  
};  

let isEditing = false;  

document.getElementById("resumeForm")!.addEventListener("submit", function(event) {  
    event.preventDefault(); // Prevent page refresh  
    generateResume();  
});  

document.getElementById("addExperience")!.addEventListener("click", function() {  
    const newExperienceInput = document.createElement("input");  
    newExperienceInput.type = "text";  
    newExperienceInput.className = "experience";  
    newExperienceInput.placeholder = "Experience Title";  
    document.getElementById("experienceContainer")!.appendChild(newExperienceInput);  
});  

document.getElementById("addEducation")!.addEventListener("click", function() {  
    const newEducationInput = document.createElement("input");  
    newEducationInput.type = "text";  
    newEducationInput.className = "education";  
    newEducationInput.placeholder = "Education Title";  
    document.getElementById("educationContainer")!.appendChild(newEducationInput);  
});  

document.getElementById("addSkill")!.addEventListener("click", function() {  
    const newSkillInput = document.createElement("input");  
    newSkillInput.type = "text";  
    newSkillInput.className = "skill";  
    newSkillInput.placeholder = "Skill";  
    document.getElementById("skillsContainer")!.appendChild(newSkillInput);  
});  

function generateResume() {  
    // Gather form inputs  
    resume.name = (document.getElementById("name") as HTMLInputElement).value;  
    resume.email = (document.getElementById("email") as HTMLInputElement).value;  
    resume.phone = (document.getElementById("phone") as HTMLInputElement).value;  

    // Experience  
    const experienceInputs = document.querySelectorAll(".experience");  
    resume.experience = Array.from(experienceInputs).map(input => (input as HTMLInputElement).value).filter(value => value.trim() !== "");  

    // Education  
    const educationInputs = document.querySelectorAll(".education");  
    resume.education = Array.from(educationInputs).map(input => (input as HTMLInputElement).value).filter(value => value.trim() !== "");  

    // Skills  
    const skillsInputs = document.querySelectorAll(".skill");  
    resume.skills = Array.from(skillsInputs).map(input => (input as HTMLInputElement).value).filter(value => value.trim() !== "");  

    displayResume();  
}  

function displayResume() {  
    const resumeOutput = document.getElementById("resumeOutput")!;  
    resumeOutput.innerHTML = `  
        <h2>${resume.name}</h2>  
        <p>Email: ${resume.email}</p>  
        <p>Phone: ${resume.phone}</p>  
        <h3>Experience</h3>  
        <ul>  
            ${resume.experience.map(exp => `<li>${exp} <button class="editExp">Edit</button></li>`).join('')}  
        </ul>  
        <h3>Education</h3>  
        <ul>  
            ${resume.education.map(edu => `<li>${edu} <button class="editEdu">Edit</button></li>`).join('')}  
        </ul>  
        <h3>Skills</h3>  
        <ul>  
            ${resume.skills.map(skill => `<li>${skill} <button class="editSkill">Edit</button></li>`).join('')}  
        </ul>  
        <button id="toggleEdit">Edit</button>  
    `;  

    document.getElementById("inputSection")!.style.display = "none";  
    resumeOutput.style.display = "block";  

    // Add event listener for edit button  
    document.getElementById("toggleEdit")!.addEventListener("click", function() {  
        isEditing = !isEditing;  
        toggleEditingMode(isEditing);  
    });  

    // Add event listeners for editing individual items  
    addEditListeners();  
}  

function toggleEditingMode(isEditing: boolean) {  
    const resumeOutput = document.getElementById("resumeOutput")!;  
    const editButton = document.getElementById("toggleEdit")!;  
    
    if (isEditing) {  
        editButton.textContent = "Save";  
        resumeOutput.querySelectorAll('li').forEach(item => {  
            item.querySelector('button')!.style.display = 'none'; // Hide edit buttons  
            const text = item.textContent?.replace('Edit', '').trim();  
            item.innerHTML = `<input type="text" value="${text}" /> <button class="save">Save</button>`;  
        });  

        // Add event listeners for save buttons in edit mode  
        resumeOutput.querySelectorAll('.save').forEach((button, index) => {  
            button.addEventListener("click", () => {  
                const input = button.previousElementSibling as HTMLInputElement;  
                const newValue = input.value;  
                if (newValue.trim() === "") return; // Ignore empty values  
                updateItemInResume(type ,index, newValue);  
            });  
        });  
    } else {  
        editButton.textContent = "Edit";  
        displayResume(); // Refresh with current resume data  
    }  
}  

function addEditListeners() {  
    document.querySelectorAll(".editExp").forEach((button, index) => {  
        button.addEventListener("click", () => editItem('experience', index));  
    });  

    document.querySelectorAll(".editEdu").forEach((button, index) => {  
        button.addEventListener("click", () => editItem('education', index));  
    });  

    document.querySelectorAll(".editSkill").forEach((button, index) => {  
        button.addEventListener("click", () => editItem('skills', index));  
    });  
}  

function editItem(type: keyof Resume, index: number) {  
    const resumeOutput = document.getElementById("resumeOutput")!;  
    const list = resumeOutput.querySelector(`ul:nth-of-type(${type === 'experience' ? 1 : type === 'education' ? 2 : 3})`)!;  
    const itemToEdit = list.children[index].textContent?.replace('Edit', '').trim();  

    if (itemToEdit) {  
        list.children[index].innerHTML = `<input type="text" value="${itemToEdit}" /> <button class="save">Save</button>`;  
        
        // Add event listener for the save button  
        list.children[index].querySelector('.save')!.addEventListener("click", () => {  
            const input = list.children[index].querySelector('input') as HTMLInputElement;  
            const newValue = input.value;  
            if (newValue.trim() === "") return; // Ignore empty values  
            updateItemInResume(type, index, newValue);  
        });  
    }  
}  

function updateItemInResume(type: keyof Resume, index: number, newValue: string) {  
    const resumeOutput = document.getElementById("resumeOutput")!;  
    const list = resumeOutput.querySelector(`ul:nth-of-type(${type === 'experience' ? 1 : type === 'education' ? 2 : 3})`)!;  
resume[index] = newValue; // Update the resume data  
    list.children[index].innerHTML = `${newValue} <button class="edit${capitalizeFirstLetter(type)}">Edit</button>`;  
    
    // Re-add event listener for the edit button  
    list.children[index].querySelector('button')!.addEventListener("click", () => editItem(type, index));  
}  

function capitalizeFirstLetter(string: string) {  
    return string.charAt(0).toUpperCase() + string.slice(1);  
}  