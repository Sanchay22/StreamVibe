const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||'';
export const signIn = async ({ usernameOrEmail, password }) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
        method: 'POST',
        credentials:"include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed!'); // Handle error response
    }

    return response.json(); // Return the response data
};
export const register=async (formData)=>{
    const response=await fetch(`${API_BASE_URL}/api/v1/users/register`,{
        method:"POST",
        credentials:"include",
        body:formData
    })
    const body=await response.json();
    if(!response.ok){
        throw new Error(body.message)
    }return body;
}
export const getUser=async()=>{
    const response=await fetch(`${API_BASE_URL}/api/v1/users/current-user`,{
        credentials:"include",
        method:"GET",
    })
    if(!response.ok){
        throw new Error("Error fetching user")
    }return response.json();
}
export const logout=async()=>{
    const response=await fetch(`${API_BASE_URL}/api/v1/users/logout`,{
        method:"POST",
        credentials:"include",
    })
    if(!response.ok){
        throw new Error("Error fetching user")
    }
    const body=response.json();
    return body;
}
export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/validate-token`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Token invalid");
    }
    const body=await response.json();
    return body;
};

//video upload
export const uploadVideo=async(formData)=>{
    const response =await fetch(`${API_BASE_URL}/api/v1/videos`,{
        credentials:"include",
        method:"POST",
        body:formData
    })
    const body=await response.json();
    if(!response.ok){
        throw new Error(body.message)
    }
    return body;
}