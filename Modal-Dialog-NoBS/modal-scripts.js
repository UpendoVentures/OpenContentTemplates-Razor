document.addEventListener("DOMContentLoaded", async function () {
    await showModal();
});

async function showModal() {
    try {
        const response = await fetch(window.modalConfig.verificationEndPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                moduleid: window.modalConfig.moduleId,
                tabid: window.modalConfig.tabId
            }
        });

        const data = await response.json();
        if (data.showModal) {
            openModal();
        }
    } catch (error) {
        console.error("Error fetching verification status:", error);
    }
}

function openModal() {
    const myModal = document.getElementById(window.modalConfig.modalId);
    myModal.style.display = "block";
    setTimeout(() => {
        myModal.classList.add("show");
    }, 10);
}

function closeModal() {
    const myModal = document.getElementById(window.modalConfig.modalId);
    myModal.classList.remove("show");
    setTimeout(() => {
        myModal.style.display = "none";
    }, 300);
}

async function confirmEmail() {
    if (!document.getElementById("emailConfirm").checked) {
        alert(window.modalConfig.nonConfirmMessage);
        return;
    }

    try {
        const response = await fetch(window.modalConfig.confirmationEndPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                moduleid: window.modalConfig.moduleId,
                tabid: window.modalConfig.tabId
            },
            body: JSON.stringify({ userId: window.modalConfig.userId })
        });

        const data = await response.json();
        if (data.success) {
            closeModal();
        } else {
            alert(window.modalConfig.confirmErrorMessage);
        }
    } catch (error) {
        console.error("Error confirming email:", error);
        alert(window.modalConfig.genericErrorMessage);
    }
}

function redirectToProfile(id) {
    window.location.href = `${window.modalConfig.secondaryButtonLink}/${id}`;
}
