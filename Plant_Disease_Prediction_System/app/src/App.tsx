import { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Leaf, 
  AlertCircle, 
  CheckCircle2, 
  Sprout, 
  Shield, 
  Droplets, 
  Scissors,
  FlaskConical,
  Sun,
  Wind,
  Image as ImageIcon,
  X,
  ScanLine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircularProgress } from '@/components/ui/circular-progress';

// Disease data type
interface DiseaseResult {
  name: string;
  probability: number;
  description: string;
}

interface Solution {
  organic: string[];
  chemical: string[];
  prevention: string[];
}

// Mock disease data for demonstration
const mockDiseases: DiseaseResult[] = [
  { 
    name: 'Early Blight', 
    probability: 82, 
    description: 'A fungal disease caused by Alternaria solani, characterized by dark brown spots with concentric rings on leaves.' 
  },
  { 
    name: 'Leaf Mold', 
    probability: 12, 
    description: 'A fungal disease that causes yellow spots on upper leaf surfaces and olive-green mold on undersides.' 
  },
  { 
    name: 'Healthy', 
    probability: 6, 
    description: 'The plant appears to be healthy with no visible signs of disease.' 
  },
];

const mockSolutions: Solution = {
  organic: [
    'Spray neem oil solution (2-3 ml per liter of water)',
    'Remove and destroy infected leaves immediately',
    'Apply compost tea as a foliar spray',
    'Use baking soda spray (1 tbsp per gallon of water)',
  ],
  chemical: [
    'Apply Mancozeb fungicide (2g per liter of water)',
    'Use Chlorothalonil-based fungicides',
    'Spray Copper-based fungicides for prevention',
  ],
  prevention: [
    'Maintain proper spacing between plants for air circulation',
    'Avoid overhead watering to reduce leaf moisture',
    'Rotate crops annually to prevent soil-borne infections',
    'Mulch around plants to prevent soil splash',
    'Water early in the day so leaves dry quickly',
  ],
};

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPG, JPEG, or PNG)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setShowResults(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(null);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPG, JPEG, or PNG)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setShowResults(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setShowResults(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get the most likely disease (highest probability)
  const mostLikelyDisease = mockDiseases.reduce((prev, current) => 
    prev.probability > current.probability ? prev : current
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 leaf-pattern">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-900">
              Plant Disease Prediction System
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        {!uploadedImage && !showResults && (
          <section className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sprout className="h-4 w-4" />
              <span>AI-Powered Plant Health Analysis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Identify Plant Diseases
              <span className="block text-green-600">in Seconds</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Upload an image of your plant leaf and our AI system will analyze it to identify 
              possible diseases, provide probability scores, and suggest effective solutions.
            </p>
          </section>
        )}

        {/* Upload Section */}
        <section className="mb-8">
          {!uploadedImage ? (
            <Card className="border-2 border-dashed border-green-300 bg-white/70 backdrop-blur-sm hover:border-green-500 hover:bg-white/90 transition-all duration-300">
              <CardContent className="p-8 sm:p-12">
                <div
                  onClick={handleUploadClick}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="bg-green-100 p-4 rounded-full mb-4 animate-pulse-ring">
                    <Upload className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload Leaf Image
                  </h3>
                  <p className="text-gray-500 text-center mb-4 max-w-md">
                    Drag and drop your image here, or click to browse
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <ImageIcon className="h-4 w-4" />
                    <span>Supports: JPG, JPEG, PNG</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-green-200 animate-scale-in">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded plant leaf"
                      className="w-48 h-48 object-cover rounded-xl shadow-lg"
                    />
                    <button
                      onClick={handleClearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Image Uploaded Successfully
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your image is ready for analysis. Click the button below to identify potential diseases.
                    </p>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-200"
                    >
                      {isAnalyzing ? (
                        <>
                          <ScanLine className="h-5 w-5 mr-2 animate-pulse" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <ScanLine className="h-5 w-5 mr-2" />
                          Analyze Leaf
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mt-4 animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </section>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-8 animate-fade-in">
            {/* Disease Probabilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ScanLine className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              </div>
              
              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardContent className="p-6 sm:p-8">
                  <p className="text-gray-600 mb-8 text-center">
                    Based on the image analysis, here are the possible conditions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">
                    {mockDiseases.map((disease, index) => (
                      <CircularProgress
                        key={disease.name}
                        percentage={disease.probability}
                        label={disease.name}
                        delay={index * 200}
                        size={160}
                        strokeWidth={12}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Most Likely Disease */}
            <section>
              <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0 shadow-xl shadow-green-200">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-green-100 mb-1">
                        Most Likely Condition
                      </h3>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                        {mostLikelyDisease.name}
                      </h2>
                      <p className="text-green-50 leading-relaxed max-w-3xl">
                        {mostLikelyDisease.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                        <span className="text-2xl font-bold">{mostLikelyDisease.probability}%</span>
                        <span className="text-green-100">confidence</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Solutions Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Recommended Solutions</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Organic Solutions */}
                <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Sprout className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">Organic Solutions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mockSolutions.organic.map((solution, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Chemical Treatment */}
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FlaskConical className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">Chemical Treatment</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mockSolutions.chemical.map((solution, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Droplets className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Prevention Tips */}
                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-amber-600" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">Prevention Tips</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mockSolutions.prevention.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Sun className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Analyze Another Button */}
            <div className="text-center pt-8">
              <Button
                onClick={handleClearImage}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl font-medium transition-all duration-300"
              >
                <Upload className="h-5 w-5 mr-2" />
                Analyze Another Image
              </Button>
            </div>
          </div>
        )}

        {/* Features Section (shown only when no results) */}
        {!showResults && (
          <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ScanLine className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 text-sm">Advanced machine learning algorithms for accurate disease detection</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Solutions</h3>
              <p className="text-gray-600 text-sm">Get personalized treatment recommendations for your plants</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wind className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prevention Tips</h3>
              <p className="text-gray-600 text-sm">Learn how to protect your plants from future infections</p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-green-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="text-gray-700 font-medium">Plant Disease Prediction System</span>
            </div>
            <p className="text-gray-500 text-sm">
              Helping farmers and gardeners identify plant diseases quickly and accurately.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
