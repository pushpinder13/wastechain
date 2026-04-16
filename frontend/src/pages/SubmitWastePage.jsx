import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wasteAPI, aiAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Upload, Sparkles, Trash2, Check, X, Loader, Info, Recycle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';

export default function SubmitWastePage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    category: 'Plastic',
    weight: '',
    description: '',
    address: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const categories = ['Plastic', 'Paper', 'Metal', 'Glass', 'E-waste', 'Organic', 'Other'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAiPrediction(null);
    }
  };

  const handleAIDetection = async () => {
    if (!image) return;
    
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      
      const { data } = await aiAPI.analyzeImage(formData);
      setAiPrediction(data.prediction);
      
      if (data.prediction.type && categories.includes(data.prediction.type)) {
        setFormData(prev => ({ ...prev, category: data.prediction.type }));
      }
    } catch (error) {
      console.error('AI detection error:', error);
      alert('AI analysis failed. Please try again or enter the details manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const clearAIPrediction = () => {
    setAiPrediction(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('category', formData.category);
      submitData.append('weight', formData.weight);
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);
      if (image) submitData.append('image', image);

      await wasteAPI.create(submitData);

      // Refetch user profile to update points
      const { data: updatedUser } = await authAPI.getProfile();
      setUser(updatedUser);
      
      navigate('/my-submissions');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit waste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Submit Waste for Recycling</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image Upload and AI */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-semibold mb-4">1. Upload Photo</h2>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  {preview ? (
                    <div className="space-y-4">
                      <img src={preview} alt="Preview" className="max-h-60 mx-auto rounded-lg shadow-md" />
                      <Button type="button" variant="secondary" onClick={() => {
                        setImage(null);
                        setPreview(null);
                        setAiPrediction(null);
                        document.getElementById('image-upload').value = '';
                      }}>
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                      <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Choose an Image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </Card>

              {image && (
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-primary-500"/>
                    2. AI Analysis
                  </h2>
                  {!aiPrediction && !analyzing && (
                     <Button type="button" onClick={handleAIDetection} className="w-full">
                      Analyze Waste Type
                    </Button>
                  )}
                  {analyzing && (
                    <div className="flex items-center justify-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <Loader className="animate-spin w-6 h-6 mr-3 text-primary-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Analyzing image...</span>
                    </div>
                  )}
                  {aiPrediction && (
                    <div className="space-y-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">AI Detection Result</h3>
                        <button onClick={clearAIPrediction} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <X className="w-5 h-5"/>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Info className="w-5 h-5 text-green-600 dark:text-green-400"/>
                        <p>Type: <strong className="font-semibold">{aiPrediction.type}</strong></p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Recycle className="w-5 h-5 text-green-600 dark:text-green-400"/>
                        <p>Recyclable: <strong className="font-semibold">{aiPrediction.recyclable ? 'Yes' : 'No'}</strong></p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">Disposal Instructions:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{aiPrediction.disposalInstructions}</p>
                      </div>

                       {aiPrediction.suggestions && aiPrediction.suggestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">Suggestions:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {aiPrediction.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                       )}
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Right Column: Form */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">3. Submission Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Waste Category</label>
                  <select className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg, approx.)</label>
                  <input type="number" step="0.1" className="input" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="input" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g., 'Cardboard boxes', 'Plastic bottles'" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Address</label>
                  <textarea className="input" rows="2" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required placeholder="Enter your full address" />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader className="animate-spin w-5 h-5 mr-2 inline" /> Submitting...</>
                  ) : (
                    <><Trash2 className="w-5 h-5 mr-2 inline" /> Submit Waste</>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
