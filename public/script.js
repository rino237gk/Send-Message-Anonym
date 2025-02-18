document.getElementById("messageForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const message = document.getElementById("message").value.trim();
    if (!message) {
      showAlert("Pesan tidak boleh kosong.", "danger");
      return;
    }
  
    try {
      const response = await fetch("/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
  
      const data = await response.json();
      if (response.ok) {
        showAlert(data.message, "success");
        document.getElementById("messageForm").reset();
      } else {
        showAlert(data.error, "danger");
      }
    } catch (error) {
      showAlert("Terjadi kesalahan saat mengirim pesan.", "danger");
    }
  });
  
  function showAlert(message, type) {
    const alertDiv = document.getElementById("messageAlert");
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.display = "block";
  
    // Sembunyikan alert setelah 3 detik
    setTimeout(() => {
      alertDiv.style.display = "none";
    }, 3000);
  }