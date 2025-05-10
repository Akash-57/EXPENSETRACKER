import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (data, filename) => {
  try {
    let csvContent = "Report Type,Summary\n";
    csvContent += `Date Range,${data.dateRange.start} to ${data.dateRange.end}\n\n`;
    csvContent += "Metric,Value\n";
    Object.entries(data.summary).forEach(([key, value]) => {
      if (typeof value === 'object') {
        if (key === 'categories') {
          csvContent += "\nExpense Categories\n";
          data.summary.categories.forEach(cat => {
            csvContent += `${cat.name},$${cat.amount.toFixed(2)},${cat.percentage.toFixed(1)}%\n`;
          });
        } else {
          csvContent += `${key},${JSON.stringify(value)}\n`;
        }
      } else {
        csvContent += `${key},${value}\n`;
      }
    });
    if (data.trends && data.trends.length > 0) {
      csvContent += "\nMonthly Trends\n";
      csvContent += "Month,Income,Expense,Net\n";
      data.trends.forEach(trend => {
        csvContent += `${trend.month},$${trend.income.toFixed(2)},$${trend.expense.toFixed(2)},$${trend.net.toFixed(2)}\n`;
      });
    }
    if (data.filteredTransactions && data.filteredTransactions.length > 0) {
      csvContent += "\nTransactions\n";
      csvContent += "Date,Description,Category,Type,Amount\n";
      data.filteredTransactions.forEach(transaction => {
        csvContent += `${new Date(transaction.date).toLocaleDateString()},${transaction.description},${transaction.category},${transaction.type},$${transaction.amount.toFixed(2)}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
};

export const exportToPDF = (data, filename) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Financial Report', 14, 15);
  doc.setFontSize(12);
  doc.text(`Date Range: ${data.dateRange.start} to ${data.dateRange.end}`, 14, 25);
  doc.autoTable({
    startY: 30,
    head: [['Metric', 'Value']],
    body: [
      ['Total Income', `$${data.summary.totalIncome.toFixed(2)}`],
      ['Total Expenses', `$${data.summary.totalExpenses.toFixed(2)}`],
      ['Net Amount', `$${data.summary.netAmount.toFixed(2)}`],
      ['Average Daily', `$${data.summary.averageDaily.toFixed(2)}`],
      ['Largest Expense', `$${data.summary.largestExpense.amount.toFixed(2)} (${data.summary.largestExpense.category})`],
      ['Largest Income', `$${data.summary.largestIncome.amount.toFixed(2)} (${data.summary.largestIncome.category})`],
    ],
  });
  if (data.summary.categories && data.summary.categories.length > 0) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Category', 'Amount', 'Percentage']],
      body: data.summary.categories.map(cat => [
        cat.name,
        `$${cat.amount.toFixed(2)}`,
        `${cat.percentage.toFixed(1)}%`
      ]),
    });
  }
  if (data.trends && data.trends.length > 0) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Month', 'Income', 'Expense', 'Net']],
      body: data.trends.map(trend => [
        trend.month,
        `$${trend.income.toFixed(2)}`,
        `$${trend.expense.toFixed(2)}`,
        `$${trend.net.toFixed(2)}`
      ]),
    });
  }

  doc.save(`${filename}.pdf`);
};