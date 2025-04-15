import { adminAxiosInstance } from "@/api/adminAxios";


export const logoutAdmin = async()=>{
    const response = await adminAxiosInstance.post("/_ad/admin/logout");
    return response.data
}

export const getAllCarRequests = async({
    page = 1,
    limit = 10,
    search=""
}:{
    page:number,
    limit:number,
    search:string
})=>{
    const response = await adminAxiosInstance.get("/_ad/admin/get-allCarRequests",{
        params:{
            page,
            limit,
            search
        }
    })
    return response.data
}

export const getSellerDetails = async(sellerId:string)=>{
        const response = await adminAxiosInstance.get(`/_ad/admin/seller-details/${sellerId}`);
        return response.data
}

export const getAllCustomers = async({
    page = 1,
    limit = 10,
    search = ""
}:{
    page:number,
    limit:number,
    search:string
})=>{
    const response = await adminAxiosInstance.get("/_ad/admin/get-allusers",{
        params:{
            page,
            limit,
            search
        }
    });
    return response.data
}

export const updateStatus = async(userId:string)=>{
    try {
        const response = await adminAxiosInstance.patch(`/_ad/admin/customer-status/${userId}`,{});
        return response.data
    } catch (error:any) {
        throw new Error(error.response?.data?.message || "Failed to update status");
    }
}

export const getAllSellerRequest = async({
    page = 1,
    limit = 10,
    search = ""
}:{
    page:number,
    limit:number,
    search:string
})=>{
    const response = await adminAxiosInstance.get("/_ad/admin/get-allSellerRequests",{
        params:{
            page,
            limit,
            search
        }
    });
    return response.data
}

export const updateSellerRequestStatus = async(userId:string,status:string)=>{
    try {
        console.log("userId in seller request service",userId)
        const response = await adminAxiosInstance.patch(`/_ad/admin/sellerRequest-update/${userId}`,
            {status}
        )
        return response.data
    } catch (error:any) {
        throw new Error(error.response?.data?.message || "Failed to update status");
    }

}