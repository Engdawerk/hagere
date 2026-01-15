import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
//import { deleteProduct } from "../../../BACKEND/controllers/productController";

// Base URL for the API
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProduct();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in addProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  fetchProduct: async () => {
    set({ loading: true, error: null }); // Reset error when starting to load
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      console.log("API Response:", response);
      // Make sure response.data.data exists and is an array
      if (response.data?.success) {
          set({ products: response.data.data, error: null });
      } else {
          throw new Error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Error fetching products:", error); // Log error details
      if (error.response?.status === 429) {
          set({ error: "Rate limit exceeded" });
      } else if (error.response) {
          // Handle specific HTTP errors
          set({ error: `HTTP error: ${error.response.status} - ${error.response.data}` });
      } else {
          set({ error: "Something went wrong" });
      }
    } finally {
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    console.log("deleteProduct", id);
    set({ loading: true});
    try{
     await axios.delete(`${BASE_URL}/api/products/${id}`);
     set(prev => ({products: prev.products.filter(product => product.id !== id)}));
     toast.success("Product deleted successfully");
    }catch (error){
      console.log("Error in deleteProduct function", error);
      toast.error("Something went wrong");
    }finally{
      set({ loading: false});
    }
    
  },

  fetchoneProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, // pre-fill form with current product data
        error: null,
      });
    } catch (error) {
      console.log("Error in fetchProduct function", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error in updateProduct function", error);
    } finally {
      set({ loading: false });
    }
  },
}));