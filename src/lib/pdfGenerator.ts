import jsPDF from "jspdf";
import { Message } from "@/types";

// Fonction pour ajouter du texte avec support des caractères arabes et accents
const addText = (doc: jsPDF, text: string, x: number, y: number, options?: { align?: "left" | "center" | "right"; maxWidth?: number }) => {
  if (options?.align === "center") {
    doc.text(text, x, y, { align: "center", maxWidth: options.maxWidth });
  } else if (options?.align === "right") {
    doc.text(text, x, y, { align: "right", maxWidth: options.maxWidth });
  } else {
    doc.text(text, x, y, { maxWidth: options?.maxWidth });
  }
};

export const generateMessagePDF = (message: Message) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 20;

  // En-tête avec logo et informations
  doc.setFillColor(0, 51, 153); // Bleu Roi
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  addText(doc, "HOUSE OF TRAVEL", pageWidth / 2, 15, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  addText(doc, "Agence de Voyages", pageWidth / 2, 22, { align: "center" });
  
  // Date du jour
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  addText(doc, `Date: ${today}`, pageWidth / 2, 32, { align: "center" });

  yPosition = 50;

  // Titre du document
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const docTitle = `FICHE DE DEMANDE - ${message.type.toUpperCase()}`;
  addText(doc, docTitle, pageWidth / 2, yPosition, { align: "center" });
  
  yPosition += 15;

  // Ligne de séparation
  doc.setDrawColor(0, 51, 153);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 10;

  // Section Client
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 153);
  addText(doc, "INFORMATIONS CLIENT", margin, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const clientInfo = [
    { label: "Nom", value: message.name },
    { label: "Prenom", value: message.type === "Devis" ? message.devisDetails?.prenom : message.billeterieDetails?.prenom },
    { label: "Email", value: message.email },
    { label: "Telephone", value: message.phone || "Non specifie" },
  ];

  clientInfo.forEach(info => {
    if (info.value) {
      doc.setFont("helvetica", "bold");
      addText(doc, `${info.label}:`, margin + 5, yPosition);
      doc.setFont("helvetica", "normal");
      addText(doc, info.value, margin + 40, yPosition);
      yPosition += 6;
    }
  });

  yPosition += 5;

  // Section Détails selon le type
  if (message.type === "Devis" && message.devisDetails) {
    yPosition = addDevisDetails(doc, message.devisDetails, yPosition, margin, pageWidth, pageHeight);
  } else if (message.type === "Billetterie" && message.billeterieDetails) {
    yPosition = addBilleterieDetails(doc, message.billeterieDetails, yPosition, margin, pageWidth, pageHeight);
  }

  // Message additionnel
  if (message.content && message.content.trim() !== "") {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 153);
    addText(doc, "MESSAGE", margin, yPosition);
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    const splitMessage = doc.splitTextToSize(message.content, pageWidth - 2 * margin - 10);
    splitMessage.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      addText(doc, line, margin + 5, yPosition);
      yPosition += 5;
    });
  }

  // Pied de page
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "italic");
  addText(doc, "www.houseoftravel.com - Votre partenaire de confiance pour vos voyages", pageWidth / 2, footerY, { align: "center" });

  // Télécharger le PDF
  const fileName = `${message.type}_${message.name.replace(/\s+/g, "_")}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

const addDevisDetails = (doc: jsPDF, details: any, yPosition: number, margin: number, pageWidth: number, pageHeight: number): number => {
  const sections = [
    {
      title: "DETAILS DU VOYAGE",
      fields: [
        { label: "Destination", value: details.destination },
        { label: "Besoin de VISA", value: details.besoinVisa },
        { label: "Vol", value: details.volAvecSans },
      ]
    },
    {
      title: "HEBERGEMENT",
      fields: [
        { label: "Hotel", value: details.nomHotel },
        { label: "Nombre d'etoiles", value: details.nombreEtoiles },
        { label: "Nombre de chambres", value: details.nombreChambres },
        { label: "Type de chambre", value: details.typeChambre },
      ]
    },
    {
      title: "PASSAGERS",
      fields: [
        { label: "Pension", value: details.pension },
        { label: "Adultes", value: details.nombreAdultes },
        { label: "Enfants", value: details.nombreEnfants },
        { label: "Age des enfants", value: details.ageEnfants },
      ]
    },
    {
      title: "DATES",
      fields: [
        { label: "Depart", value: details.dateDepart },
        { label: "Retour", value: details.dateRetour },
      ]
    }
  ];

  sections.forEach(section => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 153);
    addText(doc, section.title, margin, yPosition);
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    section.fields.forEach(field => {
      if (field.value && field.value.trim() !== "") {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFont("helvetica", "bold");
        addText(doc, `${field.label}:`, margin + 5, yPosition);
        doc.setFont("helvetica", "normal");
        addText(doc, field.value, margin + 50, yPosition);
        yPosition += 6;
      }
    });

    yPosition += 5;
  });

  return yPosition;
};

const addBilleterieDetails = (doc: jsPDF, details: any, yPosition: number, margin: number, pageWidth: number, pageHeight: number): number => {
  const sections = [
    {
      title: "DETAILS DU VOL",
      fields: [
        { label: "Destination", value: details.destination },
        { label: "Besoin de VISA", value: details.besoinVisa },
        { label: "Compagnie Aerienne", value: details.compagnie },
      ]
    },
    {
      title: "PASSAGERS",
      fields: [
        { label: "Adultes", value: details.nombreAdultes },
        { label: "Enfants", value: details.nombreEnfants },
        { label: "Age des enfants", value: details.ageEnfants },
      ]
    },
    {
      title: "DATES",
      fields: [
        { label: "Depart", value: details.dateDepart },
        { label: "Retour", value: details.dateRetour },
      ]
    }
  ];

  sections.forEach(section => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 153);
    addText(doc, section.title, margin, yPosition);
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    section.fields.forEach(field => {
      if (field.value && field.value.trim() !== "") {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFont("helvetica", "bold");
        addText(doc, `${field.label}:`, margin + 5, yPosition);
        doc.setFont("helvetica", "normal");
        addText(doc, field.value, margin + 50, yPosition);
        yPosition += 6;
      }
    });

    yPosition += 5;
  });

  return yPosition;
};
