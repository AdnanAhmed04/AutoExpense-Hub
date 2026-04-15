import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a professional PDF report for vehicle expenses.
 * 
 * @param {Object} car - The vehicle object containing make, model, year, and licensePlate.
 * @param {Array} expenses - Array of expense objects.
 * @param {Object} user - The current user object.
 * @param {Number} totalSpent - The total calculated expense amount.
 */
export const generateExpensePDF = (car, expenses, user, totalSpent) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header Section ---
    // Dark background for header
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(0, 0, pageWidth, 40, 'F');

    // App Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('AutoExpense Hub', 15, 25);

    // Document Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Expense Breakdown Report', pageWidth - 15, 25, { align: 'right' });

    // --- Content Section ---
    // Reset colors
    doc.setTextColor(0, 0, 0);

    // Vehicle Info Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Vehicle Information', 15, 55);

    // Subtle horizontal line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(15, 58, pageWidth - 15, 58);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const detailsLeft = 15;
    const detailsRight = pageWidth / 2 + 10;
    const startY = 68;

    doc.text('Vehicle:', detailsLeft, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${car.year} ${car.make} ${car.model}`, detailsLeft + 25, startY);

    doc.setFont('helvetica', 'bold');
    doc.text('License Plate:', detailsLeft, startY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(car.licensePlate || 'N/A', detailsLeft + 25, startY + 8);

    doc.setFont('helvetica', 'bold');
    doc.text('Owner:', detailsRight, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(user?.name || 'Valued Customer', detailsRight + 25, startY);

    doc.setFont('helvetica', 'bold');
    doc.text('Report Date:', detailsRight, startY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }), detailsRight + 25, startY + 8);

    // --- Expenses Table ---
    const tableColumn = ["Date", "Expense Title", "Category", "Amount"];
    const tableRows = expenses.map(expense => [
        new Date(expense.createdAt).toLocaleDateString(),
        expense.title,
        expense.type,
        `$${Number(expense.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ]);

    autoTable(doc, {
        startY: 95,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { 
            fillColor: [59, 130, 246], // blue-600
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 30, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 40, halign: 'center' },
            3: { cellWidth: 35, halign: 'right' }
        },
        styles: { 
            fontSize: 9, 
            cellPadding: 5,
            valign: 'middle'
        },
        alternateRowStyles: { 
            fillColor: [248, 250, 252] // slate-50
        },
        margin: { left: 15, right: 15 }
    });

    // --- Summary Section ---
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(pageWidth - 95, finalY - 5, 80, 15, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount Spent:', pageWidth - 90, finalY + 5);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(`$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - 20, finalY + 5, { align: 'right' });

    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        
        // Horizontal line for footer
        doc.setDrawColor(226, 232, 240);
        doc.line(15, doc.internal.pageSize.height - 20, pageWidth - 15, doc.internal.pageSize.height - 20);
        
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        doc.text('AutoExpense Hub - Your Digital Garage Assistant', 15, doc.internal.pageSize.height - 10);
        doc.text(`Reference ID: ${car._id || car.id}`, pageWidth - 15, doc.internal.pageSize.height - 10, { align: 'right' });
    }

    // --- Save File ---
    const fileName = `Expense_Report_${car.make}_${car.model}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};
