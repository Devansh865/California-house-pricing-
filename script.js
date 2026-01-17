document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const resultModal = document.getElementById('resultModal');
    const priceValue = document.getElementById('priceValue');
    const resetBtn = document.getElementById('resetBtn');
    const errorMessage = document.getElementById('error-message');
    const predictBtn = document.getElementById('predictBtn');
    const btnText = predictBtn.querySelector('.btn-text');
    const spinner = predictBtn.querySelector('.loading-spinner');


    // Alert on load to confirm JS is running (optional, maybe too annoying, let's skip for now)

    form.addEventListener('submit', async (e) => {
        e.preventDefault();


        try {
            // UI Loading State
            setLoading(true);
            errorMessage.classList.add('hidden');

            // Gather data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Convert strings to numbers
            for (let key in data) {
                data[key] = parseFloat(data[key]);
            }
            // Convert strings to numbers
            for (let key in data) {
                data[key] = parseFloat(data[key]);
            }

            // API Call
            // Note: If you are opening index.html as a file, this might fail due to CORS/Protocol issues.
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });



            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server returned ${response.status}: ${text}`);
            }

            const result = await response.json();


            // Show Result
            displayResult(result.price);

        } catch (error) {

            // Explicit alert for the user
            alert(`Error occurred:\n${error.message}\n\n1. Ensure 'python app.py' is running.\n2. Try running 'python -m http.server' in the folder and access via localhost.`);

            errorMessage.textContent = 'Error: ' + error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            setLoading(false);
        }
    });

    resetBtn.addEventListener('click', () => {
        resultModal.classList.remove('active');
        form.reset();
    });

    function setLoading(isLoading) {
        if (isLoading) {
            btnText.style.opacity = '0';
            spinner.classList.remove('hidden');
            predictBtn.disabled = true;
            predictBtn.style.opacity = '0.7';
        } else {
            btnText.style.opacity = '1';
            spinner.classList.add('hidden');
            predictBtn.disabled = false;
            predictBtn.style.opacity = '1';
        }
    }

    function displayResult(price) {
        resultModal.classList.remove('hidden'); // Fix: Remove display:none
        // Force reflow to enable transition if needed, though simple removal is enough for visibility
        setTimeout(() => {
            resultModal.classList.add('active');
        }, 10);

        // Format price
        priceValue.textContent = parseFloat(price).toFixed(2);
    }
});
