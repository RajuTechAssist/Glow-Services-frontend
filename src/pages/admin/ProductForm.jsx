import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: '',
    subCategory: '',
    price: 0,
    originalPrice: '',
    stockQuantity: 0,
    lowStockThreshold: 10,
    brand: '',
    description: '',
    shortDescription: '',
    productCode: '',
    sku: '',
    images: [],
    ingredients: [],
    benefits: [],
    howToUse: '',
    featured: false,
    active: true
  });
  const [newImage, setNewImage] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    if (isEdit) fetchProduct();
  }, [isEdit]);

  const fetchProduct = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:8081/api/admin/products/${id}`);
    const data = await res.json();
    setForm(data);
    setLoading(false);
  };

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const generateSlug = (name) => name.toLowerCase().trim().replace(/\s+/g, '-');

  const handleNameChange = (value) => {
    handleChange('name', value);
    if (!isEdit) handleChange('slug', generateSlug(value));
  };

  const addToArray = (key, value) => {
    if (!value) return;
    setForm(f => ({ ...f, [key]: [...f[key], value] }));
  };

  const removeFromArray = (key, idx) => setForm(f => ({
    ...f,
    [key]: f[key].filter((_,i) => i!==idx)
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = isEdit 
      ? `http://localhost:8081/api/admin/products/${id}`
      : 'http://localhost:8081/api/admin/products';
    const method = isEdit ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setSaving(false);
    navigate('/admin/products');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-200 rounded">
          <ArrowLeft className="h-5 w-5"/>
        </button>
        <h1 className="text-2xl font-bold ml-4">{isEdit ? 'Edit' : 'Create'} Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input type="text" value={form.name} onChange={e=>handleNameChange(e.target.value)}
              required className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input type="text" value={form.slug} onChange={e=>handleChange('slug',e.target.value)}
              required className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <input type="text" value={form.category} onChange={e=>handleChange('category',e.target.value)}
              required className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sub Category</label>
            <input type="text" value={form.subCategory} onChange={e=>handleChange('subCategory',e.target.value)}
              className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price *</label>
            <input type="number" value={form.price} onChange={e=>handleChange('price',parseFloat(e.target.value))}
              required className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Original Price</label>
            <input type="number" value={form.originalPrice} onChange={e=>
              handleChange('originalPrice', parseFloat(e.target.value))}
              className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
            <input type="number" value={form.stockQuantity} onChange={e=>handleChange('stockQuantity',parseInt(e.target.value))}
              required className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
            <input type="number" value={form.lowStockThreshold} onChange={e=>handleChange('lowStockThreshold',parseInt(e.target.value))}
              className="w-full p-2 border rounded"/>
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <textarea value={form.shortDescription} onChange={e=>handleChange('shortDescription',e.target.value)}
            rows={2} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Detailed Description</label>
          <textarea value={form.description} onChange={e=>handleChange('description',e.target.value)}
            rows={4} className="w-full p-2 border rounded"/>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <div className="flex space-x-2 mb-2">
            <input type="text" value={newImage} onChange={e=>setNewImage(e.target.value)}
              placeholder="Image URL" className="flex-1 p-2 border rounded"/>
            <button type="button" onClick={()=>{
              addToArray('images', newImage);
              setNewImage('');
            }} className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
          </div>
          <ul className="list-disc pl-6">
            {form.images.map((img,i)=>(
              <li key={i} className="flex justify-between">
                <span className="truncate">{img}</span>
                <button type="button" onClick={()=>removeFromArray('images',i)} className="text-red-600">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-2">Ingredients</label>
          <div className="flex space-x-2 mb-2">
            <input type="text" value={newIngredient} onChange={e=>setNewIngredient(e.target.value)}
              placeholder="Ingredient" className="flex-1 p-2 border rounded"/>
            <button type="button" onClick={()=>{
              addToArray('ingredients', newIngredient);
              setNewIngredient('');
            }} className="px-4 py-2 bg-green-500 text-white rounded">Add</button>
          </div>
          <ul className="list-disc pl-6">
            {form.ingredients.map((ing,i)=>(
              <li key={i} className="flex justify-between">
                <span>{ing}</span>
                <button type="button" onClick={()=>removeFromArray('ingredients',i)} className="text-red-600">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-medium mb-2">Benefits</label>
          <div className="flex space-x-2 mb-2">
            <input type="text" value={newBenefit} onChange={e=>setNewBenefit(e.target.value)}
              placeholder="Benefit" className="flex-1 p-2 border rounded"/>
            <button type="button" onClick={()=>{
              addToArray('benefits', newBenefit);
              setNewBenefit('');
            }} className="px-4 py-2 bg-indigo-500 text-white rounded">Add</button>
          </div>
          <ul className="list-disc pl-6">
            {form.benefits.map((ben,i)=>(
              <li key={i} className="flex justify-between">
                <span>{ben}</span>
                <button type="button" onClick={()=>removeFromArray('benefits',i)} className="text-red-600">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* How To Use */}
        <div>
          <label className="block text-sm font-medium mb-1">How To Use</label>
          <textarea value={form.howToUse} onChange={e=>handleChange('howToUse',e.target.value)}
            rows={3} className="w-full p-2 border rounded"/>
        </div>

        {/* Flags */}
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input type="checkbox" checked={form.featured} onChange={e=>handleChange('featured',e.target.checked)} className="mr-2"/>
            Featured
          </label>
          <label className="flex items-center">
            <input type="checkbox" checked={form.active} onChange={e=>handleChange('active',e.target.checked)} className="mr-2"/>
            Active
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={()=>navigate('/admin/products')} className="px-6 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded">
            {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
