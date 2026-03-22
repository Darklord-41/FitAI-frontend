// src/utils/pdfGenerator.js
export const downloadWorkoutPDF = (workoutData) => {
    const printWindow = window.open('', '_blank', 'height=800,width=600');
    
    const htmlContent = `
        <html>
        <head>
            <title>Weekly Workout Plan</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                h1 { text-align: center; color: #0ea5e9; margin-bottom: 30px; }
                .day-section { page-break-inside: avoid; margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
                .day-title { color: #0ea5e9; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                .exercise { margin: 8px 0; padding: 8px; background-color: #f5f5f5; border-left: 3px solid #0ea5e9; padding-left: 12px; }
            </style>
        </head>
        <body>
            <h1>Weekly Workout Plan</h1>
            ${workoutData.map(day => `
                <div class="day-section">
                    <div class="day-title">${day.day}</div>
                    ${day.exercises.map(ex => `
                        <div class="exercise">• ${ex.name} - ${ex.sets}</div>
                    `).join('')}
                </div>
            `).join('')}
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
};