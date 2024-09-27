var resume = {
    name: '',
    email: '',
    phone: '',
    experience: [],
    education: [],
    skills: []
};
var isEditing = false;
document.getElementById("resumeForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh  
    generateResume();
});
document.getElementById("addExperience").addEventListener("click", function () {
    var newExperienceInput = document.createElement("input");
    newExperienceInput.type = "text";
    newExperienceInput.className = "experience";
    newExperienceInput.placeholder = "Experience Title";
    document.getElementById("experienceContainer").appendChild(newExperienceInput);
});
document.getElementById("addEducation").addEventListener("click", function () {
    var newEducationInput = document.createElement("input");
    newEducationInput.type = "text";
    newEducationInput.className = "education";
    newEducationInput.placeholder = "Education Title";
    document.getElementById("educationContainer").appendChild(newEducationInput);
});
document.getElementById("addSkill").addEventListener("click", function () {
    var newSkillInput = document.createElement("input");
    newSkillInput.type = "text";
    newSkillInput.className = "skill";
    newSkillInput.placeholder = "Skill";
    document.getElementById("skillsContainer").appendChild(newSkillInput);
});
function generateResume() {
    // Gather form inputs  
    resume.name = document.getElementById("name").value;
    resume.email = document.getElementById("email").value;
    resume.phone = document.getElementById("phone").value;
    // Experience  
    var experienceInputs = document.querySelectorAll(".experience");
    resume.experience = Array.from(experienceInputs).map(function (input) { return input.value; }).filter(function (value) { return value.trim() !== ""; });
    // Education  
    var educationInputs = document.querySelectorAll(".education");
    resume.education = Array.from(educationInputs).map(function (input) { return input.value; }).filter(function (value) { return value.trim() !== ""; });
    // Skills  
    var skillsInputs = document.querySelectorAll(".skill");
    resume.skills = Array.from(skillsInputs).map(function (input) { return input.value; }).filter(function (value) { return value.trim() !== ""; });
    displayResume();
}
function displayResume() {
    var resumeOutput = document.getElementById("resumeOutput");
    resumeOutput.innerHTML = "  \n        <h2>".concat(resume.name, "</h2>  \n        <p>Email: ").concat(resume.email, "</p>  \n        <p>Phone: ").concat(resume.phone, "</p>  \n        <h3>Experience</h3>  \n        <ul>  \n            ").concat(resume.experience.map(function (exp) { return "<li>".concat(exp, " <button class=\"editExp\">Edit</button></li>"); }).join(''), "  \n        </ul>  \n        <h3>Education</h3>  \n        <ul>  \n            ").concat(resume.education.map(function (edu) { return "<li>".concat(edu, " <button class=\"editEdu\">Edit</button></li>"); }).join(''), "  \n        </ul>  \n        <h3>Skills</h3>  \n        <ul>  \n            ").concat(resume.skills.map(function (skill) { return "<li>".concat(skill, " <button class=\"editSkill\">Edit</button></li>"); }).join(''), "  \n        </ul>  \n        <button id=\"toggleEdit\">Edit</button>  \n    ");
    document.getElementById("inputSection").style.display = "none";
    resumeOutput.style.display = "block";
    // Add event listener for edit button  
    document.getElementById("toggleEdit").addEventListener("click", function () {
        isEditing = !isEditing;
        toggleEditingMode(isEditing);
    });
    // Add event listeners for editing individual items  
    addEditListeners();
}
function toggleEditingMode(isEditing) {
    var resumeOutput = document.getElementById("resumeOutput");
    var editButton = document.getElementById("toggleEdit");
    if (isEditing) {
        editButton.textContent = "Save";
        resumeOutput.querySelectorAll('li').forEach(function (item) {
            var _a;
            item.querySelector('button').style.display = 'none'; // Hide edit buttons  
            var text = (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.replace('Edit', '').trim();
            item.innerHTML = "<input type=\"text\" value=\"".concat(text, "\" /> <button class=\"save\">Save</button>");
        });
        // Add event listeners for save buttons in edit mode  
        resumeOutput.querySelectorAll('.save').forEach(function (button, index) {
            button.addEventListener("click", function () {
                var input = button.previousElementSibling;
                var newValue = input.value;
                if (newValue.trim() === "")
                    return; // Ignore empty values  
                updateItemInResume(index, newValue);
            });
        });
    }
    else {
        editButton.textContent = "Edit";
        displayResume(); // Refresh with current resume data  
    }
}
function addEditListeners() {
    document.querySelectorAll(".editExp").forEach(function (button, index) {
        button.addEventListener("click", function () { return editItem('experience', index); });
    });
    document.querySelectorAll(".editEdu").forEach(function (button, index) {
        button.addEventListener("click", function () { return editItem('education', index); });
    });
    document.querySelectorAll(".editSkill").forEach(function (button, index) {
        button.addEventListener("click", function () { return editItem('skills', index); });
    });
}
function editItem(type, index) {
    var _a;
    var resumeOutput = document.getElementById("resumeOutput");
    var list = resumeOutput.querySelector("ul:nth-of-type(".concat(type === 'experience' ? 1 : type === 'education' ? 2 : 3, ")"));
    var itemToEdit = (_a = list.children[index].textContent) === null || _a === void 0 ? void 0 : _a.replace('Edit', '').trim();
    if (itemToEdit) {
        list.children[index].innerHTML = "<input type=\"text\" value=\"".concat(itemToEdit, "\" /> <button class=\"save\">Save</button>");
        // Add event listener for the save button  
        list.children[index].querySelector('.save').addEventListener("click", function () {
            var input = list.children[index].querySelector('input');
            var newValue = input.value;
            if (newValue.trim() === "")
                return; // Ignore empty values  
            updateItemInResume(type, index, newValue);
        });
    }
}
function updateItemInResume(type, index, newValue) {
    var resumeOutput = document.getElementById("resumeOutput");
    var list = resumeOutput.querySelector("ul:nth-of-type(".concat(type === 'experience' ? 1 : type === 'education' ? 2 : 3, ")"));
    resume[type][index] = newValue; // Update the resume data  
    list.children[index].innerHTML = "".concat(newValue, " <button class=\"edit").concat(capitalizeFirstLetter(type), "\">Edit</button>");
    // Re-add event listener for the edit button  
    list.children[index].querySelector('button').addEventListener("click", function () { return editItem(type, index); });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
