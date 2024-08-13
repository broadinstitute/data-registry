const getSeverity = (status) => {
    let severity = "";
    switch (status) {
        case "FAILED QC":
        case "FAILED":
            severity = "danger";
            break;
        case "READY FOR REVIEW":
        case "SUCCEEDED":
            severity = "success";
            break;
        case "SUBMITTED TO QC":
        case "REVIEW APPROVED":
            severity = "info";
            break;
        case "REVIEW REJECTED":
            severity = "warning";
            break;
        default:
            severity = "secondary";
    }
    return severity;
};

const getIcon = (status) => {
    let icon = "";
    switch (status) {
        case "FAILED QC":
        case "FAILED":
            icon = "bi-x";
            break;
        case "READY FOR REVIEW":
        case "SUCCEEDED":
            icon = "bi-check";
            break;
        case "SUBMITTED TO QC":
            icon = "bi-plus";
            break;
        case "REVIEW REJECTED":
            icon = "bi-x-square";
            break;
        case "REVIEW APPROVED":
            icon = "bi-check-square";
            break;
        default:
            icon = "bi-circle";
    }
    return icon;
};

export { getSeverity, getIcon };
