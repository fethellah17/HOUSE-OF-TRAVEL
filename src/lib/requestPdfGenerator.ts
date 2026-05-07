import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ServiceRequest, BilletterieRequest, VisaRequest, HotelRequest, SejourRequest } from "@/contexts/DataContext";

export const generateRequestPDF = (request: ServiceRequest) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Helper function to add text
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; fontStyle?: string; align?: "left" | "center" | "right" }) => {
    doc.setFontSize(options?.fontSize || 10);
    doc.setFont("helvetica", options?.fontStyle || "normal");
    if (options?.align === "center") {
      doc.text(text, x, y, { align: "center" });
    } else if (options?.align === "right") {
      doc.text(text, x, y, { align: "right" });
    } else {
      doc.text(text, x, y);
    }
  };

  // Helper function to add horizontal line
  const addLine = (y: number) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // Header - Logo placeholder (you can add actual logo later)
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("HOUSE OF TRAVEL", margin, yPosition);
  yPosition += 8;

  // Document title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const serviceTitle = request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1);
  doc.text(`Fiche de Demande - ${serviceTitle}`, margin, yPosition);
  yPosition += 6;

  // Generation date
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const generationDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.text(`Généré le ${generationDate}`, margin, yPosition);
  yPosition += 10;

  // Separator line
  addLine(yPosition);
  yPosition += 10;

  // Client Information Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMATIONS CLIENT", margin, yPosition);
  yPosition += 8;

  const clientData = [
    ["Nom complet", `${request.personalInfo.prenom} ${request.personalInfo.nom}`],
    ["Email", request.personalInfo.email],
    ["Téléphone", request.personalInfo.telephone],
    ["Date de demande", new Date(request.createdAt).toLocaleDateString("fr-FR")]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: clientData,
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: "auto" }
    },
    margin: { left: margin, right: margin }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Separator line
  addLine(yPosition);
  yPosition += 10;

  // Service-specific details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DÉTAILS DE LA DEMANDE", margin, yPosition);
  yPosition += 8;

  let serviceData: string[][] = [];

  if (request.serviceType === "billetterie") {
    const req = request as BilletterieRequest;
    serviceData = [
      ["Type de voyage", req.tripType],
      ["Destination", req.destination],
      ["Date de départ", new Date(req.dateDepart).toLocaleDateString("fr-FR")],
      ...(req.dateRetour ? [["Date de retour", new Date(req.dateRetour).toLocaleDateString("fr-FR")]] : []),
      ["Nombre d'adultes", req.nombreAdultes],
      ["Nombre d'enfants", req.nombreEnfants],
      ...(req.ageEnfants ? [["Âge des enfants", req.ageEnfants]] : []),
      ...(req.compagnie ? [["Compagnie aérienne", req.compagnie]] : []),
      ...(req.besoinVisa ? [["Besoin de visa", req.besoinVisa]] : [])
    ];
  } else if (request.serviceType === "visa") {
    const req = request as VisaRequest;
    serviceData = [
      ["Type de visa", req.visaType === "e-visa" ? "E-visa" : "Visa Dossier"],
      ["Pays de destination", req.pays],
      ["Date de voyage", new Date(req.dateVoyage).toLocaleDateString("fr-FR")],
      ["Passeport valide (6 mois)", req.passeportValide ? "Oui" : "Non"],
      ...(req.situationPro ? [["Situation professionnelle", req.situationPro]] : [])
    ];
  } else if (request.serviceType === "hotel") {
    const req = request as HotelRequest;
    serviceData = [
      ["Préférence", req.hotelPreference === "specific" ? "Hôtel spécifique" : "Proposition d'hôtel"],
      ...(req.hotelName ? [["Nom de l'hôtel", req.hotelName]] : []),
      ...(req.hotelCategory ? [["Catégorie", req.hotelCategory]] : []),
      ["Ville/Destination", req.city],
      ["Date d'arrivée", new Date(req.dateArrivee).toLocaleDateString("fr-FR")],
      ["Date de départ", new Date(req.dateDepart).toLocaleDateString("fr-FR")],
      ["Nombre de chambres", req.nombreChambres],
      ["Nombre de personnes", req.nombrePersonnes],
      ...(req.roomType ? [["Type de chambre", req.roomType]] : []),
      ...(req.boardBasis ? [["Type de pension", req.boardBasis]] : [])
    ];
  } else if (request.serviceType === "sejour") {
    const req = request as SejourRequest;
    serviceData = [
      ["Destination", req.destination],
      ["Type de voyage", req.typeVoyage],
      ["Budget estimé", `${req.budget} DA`],
      ["Date de départ", new Date(req.dateDepart).toLocaleDateString("fr-FR")],
      ["Date de retour", new Date(req.dateRetour).toLocaleDateString("fr-FR")],
      ...(req.servicesInclus && req.servicesInclus.length > 0 
        ? [["Services inclus", req.servicesInclus.join(", ")]] 
        : [])
    ];
  }

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: serviceData,
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: "auto" }
    },
    margin: { left: margin, right: margin }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Message section if exists
  const message = 
    (request.serviceType === "billetterie" && (request as BilletterieRequest).message) ||
    (request.serviceType === "visa" && (request as VisaRequest).message) ||
    (request.serviceType === "hotel" && (request as HotelRequest).message) ||
    (request.serviceType === "sejour" && (request as SejourRequest).preferences);

  if (message) {
    // Separator line
    addLine(yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(request.serviceType === "sejour" ? "PRÉFÉRENCES PARTICULIÈRES" : "MESSAGE / DEMANDES PARTICULIÈRES", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitMessage = doc.splitTextToSize(message, pageWidth - (margin * 2));
    doc.text(splitMessage, margin, yPosition);
    yPosition += splitMessage.length * 5;
  }

  // Footer
  yPosition = doc.internal.pageSize.getHeight() - 20;
  addLine(yPosition - 5);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("House of Travel - Votre partenaire voyage de confiance", pageWidth / 2, yPosition, { align: "center" });

  // Save PDF
  const fileName = `Demande_${serviceTitle}_${request.personalInfo.nom}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
