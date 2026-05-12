"use client";

import { useState } from 'react';
import { 
  Plus, Search, Filter, ArrowUpDown, MoreHorizontal, 
  ChevronDown, Import, Sparkles, Package, AlertCircle,
  ImagePlus, Video, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { products } from '@/data/products';
import BrutalistModal from '@/components/BrutalistModal';

// Mocked extended data to match the UI
const dashboardProducts = products.map((p, index) => ({
  ...p,
  status: index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Draft' : 'Archived',
  inventory: Math.floor(Math.random() * 10) + ' In stock',
  sales: Math.floor(Math.random() * 10),
  variants: Math.floor(Math.random() * 20),
  location: index % 2 === 0 ? 'My store' : 'JS Mob',
  valueImpact: (index % 3 === 0 ? 'High' : index % 3 === 1 ? 'Med' : 'Low') as 'High' | 'Med' | 'Low'
}));

interface Product {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  status: 'Active' | 'Draft' | 'Archived';
  inventory: string;
  sales: number;
  variants: number;
  cat: string;
  location: string;
  valueImpact: 'High' | 'Med' | 'Low';
  tag: string;
  desc: string;
  image?: string;
}


export default function ProductsManagementPage() {
  const [productList, setProductList] = useState<Product[]>(dashboardProducts as Product[]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Filter logic
  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || product.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Price,Status,Inventory"].join(",") + "\n"
      + filteredProducts.map(p => `${p.id},${p.name},${p.price},${p.status},${p.inventory}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      status: 'Active' as const,
      inventory: '10 In stock',
      sales: 0,
      variants: 1,
      cat: 'New Arrival',
      location: 'My store',
      image: '/placeholder.png',
      numericPrice: parseFloat(formData.get('price') as string) || 0,
      tag: 'New',
      desc: 'Product description',
      valueImpact: 'Med' as const
    };
    setProductList([newProduct, ...productList]);
    setImages([]);
    setVideo(null);
    setIsAddModalOpen(false);
  };

  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    const formData = new FormData(e.currentTarget);
    setProductList(prev => prev.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          name: formData.get('name') as string,
          price: formData.get('price') as string,
          numericPrice: parseFloat(formData.get('price') as string) || 0,
        };
      }
      return p;
    }));
    toast.success('Product updated successfully!');
    setEditingProduct(null);
    setImages([]);
    setVideo(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkStatusChange = (newStatus: 'Active' | 'Draft' | 'Archived') => {
    setProductList(prev => prev.map(p => 
      selectedProducts.includes(p.id) ? { ...p, status: newStatus } : p
    ));
    setSelectedProducts([]);
  };

  const handleDeleteSelected = () => {
    setProductList(prev => prev.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-black uppercase tracking-tight">Products</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Export
          </button>
          <button onClick={() => toast('Import feature coming soon!')} className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors">
            <Import size={14} /> Import
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
          >
            Add product
          </button>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <BrutalistModal 
        isOpen={isAddModalOpen || !!editingProduct} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
          setImages([]);
          setVideo(null);
        }}
        title={editingProduct ? "Edit Product" : "Create Product"}
      >
        <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Product Name</label>
            <input required name="name" defaultValue={editingProduct?.name || ""} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase focus:ring-4 focus:ring-foreground/5 outline-none" placeholder="ENTER PRODUCT NAME..." />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Retail Price ($)</label>
            <input required name="price" type="number" step="0.01" defaultValue={editingProduct?.numericPrice || editingProduct?.price?.replace(/[^0-9.]/g, '') || ""} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase focus:ring-4 focus:ring-foreground/5 outline-none" placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Media (Max 5 Images, 1 Video)</label>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square border-2 border-foreground bg-secondary/20">
                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-background text-foreground border border-foreground p-0.5 hover:bg-foreground hover:text-background transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-foreground/40 hover:border-foreground bg-secondary/10 hover:bg-secondary/30 transition-all flex flex-col items-center justify-center cursor-pointer text-foreground/40 hover:text-foreground">
                  <ImagePlus size={20} className="mb-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Add Image</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
              {!video ? (
                <label className="aspect-square border-2 border-dashed border-foreground/40 hover:border-foreground bg-secondary/10 hover:bg-secondary/30 transition-all flex flex-col items-center justify-center cursor-pointer text-foreground/40 hover:text-foreground">
                  <Video size={20} className="mb-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Add Video</span>
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                </label>
              ) : (
                <div className="relative aspect-square border-2 border-foreground bg-secondary/20 flex flex-col items-center justify-center">
                  <Video size={24} className="text-foreground" />
                  <span className="mt-2 text-[8px] font-black uppercase tracking-widest bg-background px-1">Video Added</span>
                  <button type="button" onClick={() => setVideo(null)} className="absolute top-1 right-1 bg-background text-foreground border border-foreground p-0.5 hover:bg-foreground hover:text-background transition-colors">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all">
            {editingProduct ? "Save Changes" : "Publish to Catalog"}
          </button>
        </form>
      </BrutalistModal>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-foreground bg-white dark:bg-black/20 divide-x divide-foreground">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-none">Sell Through Rate</h3>
            <div className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest border border-green-200">Optimal</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black tracking-tighter">{productList.length > 0 ? '12.4%' : '0%'}</span>
              <span className="text-[10px] font-bold text-green-500 mb-1">+2.1%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary/30 border border-foreground/5 p-[1px]">
              <div className="h-full bg-foreground" style={{ width: '12.4%' }} />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-none">Inventory Longevity</h3>
            <Sparkles size={12} className="text-foreground/20" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-tight">Healthy Status</span>
            </div>
            <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest leading-relaxed">
              {productList.length > 0 ? 'Average 42 days of stock remaining across top 80% of catalog' : 'Awaiting inventory synchronization data'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-none">Product Value</h3>
            <div className="text-[8px] font-black text-foreground/20 uppercase tracking-widest">Revenue Impact</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-px">
              <div className="px-3 py-1 bg-foreground text-background text-xs font-black border border-foreground">High: 4</div>
              <div className="px-3 py-1 bg-secondary text-foreground text-xs font-black border border-foreground">Med: 2</div>
              <div className="px-3 py-1 bg-background text-foreground/40 text-xs font-black border border-foreground">Low: 0</div>
            </div>
            <div className="flex-1 h-8 flex border border-foreground overflow-hidden">
              <div className="bg-foreground h-full" style={{ width: '60%' }} />
              <div className="bg-secondary h-full border-l border-foreground" style={{ width: '30%' }} />
              <div className="bg-background h-full border-l border-foreground" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-black/20 border border-foreground/10 overflow-hidden">
        {/* Table Tabs & Controls */}
        <div className="flex flex-col sm:flex-row justify-between border-b border-foreground/10">
          <div className="flex items-center">
            {['All', 'Active', 'Draft', 'Archived'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground/60'}`}
              >
                {tab}
              </button>
            ))}
            <button className="px-4 py-3 text-foreground/40 hover:text-foreground border-l border-foreground/10">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex items-center border-l border-foreground/10 divide-x divide-foreground/10">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-3 pl-10 pr-4 text-xs font-bold uppercase tracking-widest bg-transparent focus:outline-none w-48 lg:w-64"
              />
            </div>
          </div>
        </div>

        {/* Bulk Selection Bar */}
        {selectedProducts.length > 0 && (
          <div className="bg-secondary/50 px-4 py-3 border-b border-foreground/10 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-4">
               <input 
                type="checkbox" 
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} 
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-foreground cursor-pointer"
              />
              <span className="text-xs font-black uppercase tracking-widest text-foreground">{selectedProducts.length} selected</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleBulkStatusChange('Active')} className="px-3 py-1.5 bg-white dark:bg-black border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">Set active</button>
              <button onClick={() => handleBulkStatusChange('Draft')} className="px-3 py-1.5 bg-white dark:bg-black border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">Set draft</button>
              <button onClick={() => handleBulkStatusChange('Archived')} className="px-3 py-1.5 bg-white dark:bg-black border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">Set archived</button>
              <button onClick={handleDeleteSelected} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">Delete</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="hidden sm:table-header-group bg-secondary/20">
              <tr>
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} 
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-foreground cursor-pointer" 
                  />
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Product</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Value</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Inventory</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Sales</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Variants</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Category</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Store</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    onClick={() => {
                      setEditingProduct(product);
                      setImages([]);
                      setVideo(null);
                    }}
                    className={`hover:bg-secondary/10 transition-colors group cursor-pointer ${selectedProducts.includes(product.id) ? 'bg-secondary/5' : ''}`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 accent-foreground cursor-pointer" 
                      />
                    </td>
                    <td className="p-4 min-w-[200px]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary border border-foreground/5 flex items-center justify-center p-2 group-hover:border-foreground/20 transition-colors overflow-hidden">
                           <Package size={20} className="text-foreground/20 group-hover:text-foreground/40 transition-colors" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tight">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-4 ${
                          product.valueImpact === 'High' ? 'bg-foreground' : 
                          product.valueImpact === 'Med' ? 'bg-foreground/40' : 
                          'bg-foreground/10'
                        }`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          product.valueImpact === 'High' ? 'text-foreground' : 
                          product.valueImpact === 'Med' ? 'text-foreground/60' : 
                          'text-foreground/30'
                        }`}>
                          {product.valueImpact}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border transition-colors ${
                        product.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 
                        product.status === 'Draft' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">
                        {product.inventory}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-bold">{product.sales}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-bold">{product.variants}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">
                        {product.cat.split("'")[0]}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">
                        {product.location}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-24 text-center">
                    <AlertCircle size={40} className="mx-auto text-foreground/10 mb-4" />
                    <p className="font-display text-2xl font-black uppercase tracking-tight text-foreground/20">No products found</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mt-2">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
