export interface PharmacistDetails {
    name: string;
    licenseNumber: string;
    signature: string;
    supplier: {
        name: string;
        address: string;
        stateLicense: string;
        tel: string;
    };
}

export const pharmacistDetails: PharmacistDetails = {
    "name": "LIJUANQIUsds",
    "licenseNumber": "Zy00487661",
    "signature": "Lijuan Qiu",
    "supplier": {
        "name": "Qingdao Wanvutung Dispensary Co., Ltd",
        "address": "No. 364 Jiangshan North Road, Qingdao Free Trade Zone, Shandong, China",
        "stateLicense": "***",
        "tel": "+86(0532)86892367A"
    }
};