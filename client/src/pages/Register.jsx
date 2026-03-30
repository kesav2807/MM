import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, CheckCircle, ChevronLeft, ChevronRight, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const { updateRegData, registrationData, register } = useAuth();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Generate Height options (4ft to 7ft)
    const heightOptions = [];
    for (let ft = 4; ft <= 7; ft++) {
        for (let inch = 0; inch < 12; inch++) {
            const h = `${ft}ft ${inch}in`;
            heightOptions.push(h);
        }
    }

    // Generate Weight options (40kg to 150kg)
    const weightOptions = [];
    for (let kg = 40; kg <= 150; kg++) {
        weightOptions.push(`${kg} kg`);
    }

    const educationOptions = [
        'B.E / B.Tech', 'M.E / M.Tech', 'M.B.A', 'M.C.A', 'B.Com', 'M.Com', 
        'B.Sc', 'M.Sc', 'B.A', 'M.A', 'MBBS', 'MD', 'BDS', 'MDS', 'LLB', 'LLM', 
        'CA', 'ICWA', 'PhD', 'Diploma', 'Higher Secondary', 'Others'
    ];

    const occupationOptions = [
        'Software Professional', 'Hardware Professional', 'Engineer', 'Doctor', 
        'Nurse', 'Teacher / Professor', 'Chartered Accountant', 'Lawyer', 
        'Business Owner', 'Self-Employed', 'Manager', 'Executive', 'Civil Services (IAS/IPS)', 
        'Defence Service', 'Architect', 'Scientist', 'Others'
    ];

    const casteOptions = [
        'Adhi Dravidar', 'Agamudayar', 'Arunthathiyar', 'Brahmin', 'Chettiar', 
        'Gounder', 'Kallar', 'Maravar', 'Mukkulathor', 'Nadars', 'Naidu', 
        'Pillai', 'Thevar', 'Vanniyar', 'Viswakarma', 'Yadava', 'Others'
    ];

    const religionOptions = ['Hindu', 'Christian', 'Muslim', 'Sikh', 'Jain', 'Others'];

    const locationOptions = [
        'Madurai', 'Chennai', 'Coimbatore', 'Trichy', 'Salem', 'Tirunelveli', 
        'Thanjavur', 'Tuticorin', 'Vellore', 'Erode', 'Dindigul', 'Theni', 
        'Virudhunagar', 'Sivagangai', 'Ramnad', 'Pudukkottai', 'Others'
    ];

    const [formData, setFormData] = useState({
        // Step 1: Basic Details
        profileFor: registrationData.profileFor || '',
        name: registrationData.name || '',
        gender: registrationData.gender || '',
        dob: registrationData.dob || '',
        age: 0,
        religion: '',
        motherTongue: 'Tamil',
        maritalStatus: 'Never Married',
        
        // Step 2: Account & Location
        mobile: registrationData.mobile || '',
        email: '',
        password: '',
        confirmPassword: '',
        country: 'India',
        state: '',
        city: '',
        
        // Step 3: Personal & Professional
        height: '',
        weight: '',
        education: '',
        college: '',
        occupation: '',
        income: '',
        workLocation: '',
        caste: '',
        subCaste: '',
        starRasi: '',
        aboutSelf: '',
        
        // Step 4: Partner Preferences
        prefAgeRange: { min: 18, max: 25 },
        prefHeight: '',
        prefReligion: '',
        prefCaste: '',
        prefLocation: '',
        prefEducation: '',
        
        // Step 5: Media
        profilePhoto: ''
    });

    // Auto-calculate age
    useEffect(() => {
        if (formData.dob) {
            const today = new Date();
            const birthDate = new Date(formData.dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setFormData(prev => ({ ...prev, age: age }));
        }
    }, [formData.dob]);

    const validateStep = () => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.profileFor) newErrors.profileFor = 'Please select who the profile is for';
            if (!formData.name) newErrors.name = 'Name is required';
            if (!formData.gender) newErrors.gender = 'Gender is required';
            if (!formData.dob) newErrors.dob = 'Date of Birth is required';
            if (!formData.religion) newErrors.religion = 'Religion is required';
            if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
        } else if (step === 2) {
            if (!formData.mobile || formData.mobile.length < 10) newErrors.mobile = 'Enter a valid 10-digit mobile number';
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address';
            if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
            if (!formData.state) newErrors.state = 'State is required';
            if (!formData.city) newErrors.city = 'City is required';
        } else if (step === 3) {
            if (!formData.education) newErrors.education = 'Education details required';
            if (!formData.occupation) newErrors.occupation = 'Occupation details required';
            if (!formData.height) newErrors.height = 'Height is required';
            if (!formData.aboutSelf || formData.aboutSelf.length < 20) newErrors.aboutSelf = 'Please write at least 20 characters about yourself';
        } else if (step === 5) {
            if (!imageFile) newErrors.image = 'Profile photo is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Clear error when typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        
        if (name.includes('prefAgeRange.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                prefAgeRange: { ...prev.prefAgeRange, [field]: value }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setErrors({ ...errors, image: '' });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    }

    const prevStep = () => setStep(step - 1);

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if(!validateStep()) return;
        
        try {
            setIsUploading(true);
            let photoUrl = '';
            
            // Upload to Cloudinary via server
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('image', imageFile);
                const uploadRes = await axios.post('https://new-api-mm.onrender.com/api/users/upload-profile-photo', uploadData);
                photoUrl = uploadRes.data.url;
            }

            const userData = {
                basicInfo: {
                    profileFor: formData.profileFor,
                    name: formData.name,
                    gender: formData.gender,
                    dob: formData.dob,
                    age: formData.age,
                    religion: formData.religion,
                    motherTongue: formData.motherTongue,
                    maritalStatus: formData.maritalStatus
                },
                contactInfo: {
                    mobile: formData.mobile,
                    email: formData.email,
                    location: {
                        country: formData.country,
                        state: formData.state,
                        city: formData.city
                    }
                },
                password: formData.password,
                personalDetails: {
                    height: formData.height,
                    weight: formData.weight,
                    education: formData.education,
                    college: formData.college,
                    occupation: formData.occupation,
                    income: formData.income,
                    workLocation: formData.workLocation,
                    caste: formData.caste,
                    subCaste: formData.subCaste,
                    starRasi: formData.starRasi,
                    aboutSelf: formData.aboutSelf
                },
                partnerPreferences: {
                    ageRange: { min: formData.prefAgeRange.min, max: formData.prefAgeRange.max },
                    religion: formData.prefReligion ? [formData.prefReligion] : [],
                    caste: formData.prefCaste ? [formData.prefCaste] : [],
                    location: formData.prefLocation ? [formData.prefLocation] : [],
                    education: formData.prefEducation ? [formData.prefEducation] : []
                },
                profilePhotos: photoUrl ? [photoUrl] : []
            };

            await register(userData);
            setIsUploading(false);
            navigate('/dashboard');
        } catch (error) {
            setIsUploading(false);
            console.error('Registration failed:', error);
            alert('Registration failed. ' + (error.response?.data?.message || 'Please check your information.'));
        }
    }

    return (
        <div className="register-page">
            <Navbar />
            <div className="container reg-container">
                <div className="step-progress-header card">
                   <div className="step-labels">
                        {[1, 2, 3, 4, 5].map(s => (
                            <div key={s} className={`step-item ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                                <div className="step-circle">{step > s ? <CheckCircle size={18} /> : s}</div>
                                <span>Step {s}</span>
                            </div>
                        ))}
                   </div>
                </div>

                <div className="form-card card animate-fade">
                    {/* Step 1: Basic Details */}
                    {step === 1 && (
                        <div className="step-content">
                            <h3 className="step-title">🧩 Step 1: Basic Details</h3>
                            <div className="grid-form">
                                <div className={`form-group full-width ${errors.profileFor ? 'error' : ''}`}>
                                    <label>Profile For *</label>
                                    <select name="profileFor" value={formData.profileFor} onChange={handleChange} required>
                                        <option value="">Select</option>
                                        {['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    {errors.profileFor && <span className="error-text"><AlertCircle size={12}/> {errors.profileFor}</span>}
                                </div>
                                <div className={`form-group ${errors.name ? 'error' : ''}`}>
                                    <label>Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" />
                                    {errors.name && <span className="error-text"><AlertCircle size={12}/> {errors.name}</span>}
                                </div>
                                <div className={`form-group ${errors.gender ? 'error' : ''}`}>
                                    <label>Gender *</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.gender && <span className="error-text"><AlertCircle size={12}/> {errors.gender}</span>}
                                </div>
                                <div className={`form-group ${errors.dob ? 'error' : ''}`}>
                                    <label>Date of Birth *</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                                    {errors.dob && <span className="error-text"><AlertCircle size={12}/> {errors.dob}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Age (Auto-calc)</label>
                                    <input type="text" value={formData.age} disabled style={{ backgroundColor: '#f3f4f6' }} />
                                </div>
                                <div className={`form-group ${errors.religion ? 'error' : ''}`}>
                                    <label>Religion *</label>
                                    <select name="religion" value={formData.religion} onChange={handleChange} required>
                                        <option value="">Select</option>
                                        {['Hindu', 'Christian', 'Muslim', 'Sikh', 'Jain', 'Others'].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    {errors.religion && <span className="error-text"><AlertCircle size={12}/> {errors.religion}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Mother Tongue *</label>
                                    <select name="motherTongue" value={formData.motherTongue} onChange={handleChange}>
                                        <option value="Tamil">Tamil</option>
                                        <option value="English">English</option>
                                        <option value="Telegu">Telegu</option>
                                        <option value="Malayalam">Malayalam</option>
                                    </select>
                                </div>
                                <div className={`form-group ${errors.maritalStatus ? 'error' : ''}`}>
                                    <label>Marital Status *</label>
                                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                                        {['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    {errors.maritalStatus && <span className="error-text"><AlertCircle size={12}/> {errors.maritalStatus}</span>}
                                </div>
                            </div>
                            <div className="actions">
                                <button className="btn btn-primary" onClick={nextStep}>Continue <ChevronRight size={18} /></button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact & Account */}
                    {step === 2 && (
                        <div className="step-content">
                            <h3 className="step-title">🧩 Step 2: Contact & Account</h3>
                            <div className="grid-form">
                                <div className={`form-group ${errors.mobile ? 'error' : ''}`}>
                                    <label>Mobile Number *</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="10-digit number" />
                                    {errors.mobile && <span className="error-text"><AlertCircle size={12}/> {errors.mobile}</span>}
                                </div>
                                <div className={`form-group ${errors.email ? 'error' : ''}`}>
                                    <label>Email ID *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="example@mail.com" />
                                    {errors.email && <span className="error-text"><AlertCircle size={12}/> {errors.email}</span>}
                                </div>
                                <div className={`form-group ${errors.password ? 'error' : ''}`}>
                                    <label>Password *</label>
                                    <div className="password-input-wrapper">
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            name="password" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Min 6 characters" 
                                        />
                                        <button 
                                            type="button" 
                                            className="eye-icon" 
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && <span className="error-text"><AlertCircle size={12}/> {errors.password}</span>}
                                </div>
                                <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                                    <label>Confirm Password *</label>
                                    <div className="password-input-wrapper">
                                        <input 
                                            type={showConfirmPassword ? 'text' : 'password'} 
                                            name="confirmPassword" 
                                            value={formData.confirmPassword} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Match password" 
                                        />
                                        <button 
                                            type="button" 
                                            className="eye-icon" 
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <span className="error-text"><AlertCircle size={12}/> {errors.confirmPassword}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Country *</label>
                                    <input type="text" name="country" value={formData.country} onChange={handleChange} />
                                </div>
                                <div className={`form-group ${errors.state ? 'error' : ''}`}>
                                    <label>State *</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Required" />
                                    {errors.state && <span className="error-text"><AlertCircle size={12}/> {errors.state}</span>}
                                </div>
                                <div className={`form-group full-width ${errors.city ? 'error' : ''}`}>
                                    <label>City *</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Required" />
                                    {errors.city && <span className="error-text"><AlertCircle size={12}/> {errors.city}</span>}
                                </div>
                            </div>
                            <div className="actions">
                                <button className="btn btn-outline" onClick={prevStep}><ChevronLeft size={18} /> Back</button>
                                <button className="btn btn-primary" onClick={nextStep}>Continue <ChevronRight size={18} /></button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Personal & Professional */}
                    {step === 3 && (
                        <div className="step-content">
                            <h3 className="step-title">🧩 Step 3: Personal & Professional</h3>
                            <div className="grid-form">
                                <div className={`form-group ${errors.height ? 'error' : ''}`}>
                                    <label>Height *</label>
                                    <select name="height" value={formData.height} onChange={handleChange} required>
                                        <option value="">Select Height</option>
                                        {heightOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                    {errors.height && <span className="error-text"><AlertCircle size={12}/> {errors.height}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Weight (kg)</label>
                                    <select name="weight" value={formData.weight} onChange={handleChange}>
                                        <option value="">Select Weight</option>
                                        {weightOptions.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                                <div className={`form-group ${errors.education ? 'error' : ''}`}>
                                    <label>Education *</label>
                                    <select name="education" value={formData.education} onChange={handleChange} required>
                                        <option value="">Select Degree</option>
                                        {educationOptions.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                    {errors.education && <span className="error-text"><AlertCircle size={12}/> {errors.education}</span>}
                                </div>
                                <div className="form-group">
                                    <label>College/University</label>
                                    <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="e.g. Anna University" />
                                </div>
                                <div className={`form-group ${errors.occupation ? 'error' : ''}`}>
                                    <label>Occupation *</label>
                                    <select name="occupation" value={formData.occupation} onChange={handleChange} required>
                                        <option value="">Select Occupation</option>
                                        {occupationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    {errors.occupation && <span className="error-text"><AlertCircle size={12}/> {errors.occupation}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Annual Income</label>
                                    <select name="income" value={formData.income} onChange={handleChange}>
                                        <option value="">Select Income Range</option>
                                        {['3-5 LPA', '5-10 LPA', '10-20 LPA', '20-50 LPA', '50+ LPA'].map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Work Location</label>
                                    <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} placeholder="e.g. Chennai" />
                                </div>
                                <div className="form-group">
                                    <label>Caste *</label>
                                    <select name="caste" value={formData.caste} onChange={handleChange} required>
                                        <option value="">Select Caste</option>
                                        {casteOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Sub Caste</label>
                                    <select name="subCaste" value={formData.subCaste} onChange={handleChange}>
                                        <option value="">Select Sub Caste</option>
                                        <option value="Not Specified">Not Specified</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Star / Rasi (Tamil specific)</label>
                                    <input type="text" name="starRasi" value={formData.starRasi} onChange={handleChange} />
                                </div>
                                <div className={`form-group full-width ${errors.aboutSelf ? 'error' : ''}`}>
                                    <label>About Yourself *</label>
                                    <textarea name="aboutSelf" value={formData.aboutSelf} onChange={handleChange} rows="4" placeholder="Minimum 20 characters..."></textarea>
                                    {errors.aboutSelf && <span className="error-text"><AlertCircle size={12}/> {errors.aboutSelf}</span>}
                                </div>
                            </div>
                            <div className="actions">
                                <button className="btn btn-outline" onClick={prevStep}><ChevronLeft size={18} /> Back</button>
                                <button className="btn btn-primary" onClick={nextStep}>Continue <ChevronRight size={18} /></button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Partner Preferences */}
                    {step === 4 && (
                        <div className="step-content">
                            <h3 className="step-title">🧩 Step 4: Partner Preferences</h3>
                            <div className="grid-form">
                                <div className="form-group">
                                    <label>Preferred Age (Min)</label>
                                    <input type="number" name="prefAgeRange.min" value={formData.prefAgeRange.min} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Preferred Age (Max)</label>
                                    <input type="number" name="prefAgeRange.max" value={formData.prefAgeRange.max} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Religion Preference</label>
                                    <select name="prefReligion" value={formData.prefReligion} onChange={handleChange}>
                                        <option value="">Any Religion</option>
                                        {religionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Caste Preference</label>
                                    <select name="prefCaste" value={formData.prefCaste} onChange={handleChange}>
                                        <option value="">Any Caste</option>
                                        {casteOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Location Preference</label>
                                    <select name="prefLocation" value={formData.prefLocation} onChange={handleChange}>
                                        <option value="">Any Location</option>
                                        {locationOptions.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Education Preference</label>
                                    <select name="prefEducation" value={formData.prefEducation} onChange={handleChange}>
                                        <option value="">Any Education</option>
                                        {educationOptions.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="actions">
                                <button className="btn btn-outline" onClick={prevStep}><ChevronLeft size={18} /> Back</button>
                                <button className="btn btn-primary" onClick={nextStep}>Continue <ChevronRight size={18} /></button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Profile Image Upload */}
                    {step === 5 && (
                        <div className="step-content">
                            <h3 className="step-title">🧩 Step 5: Profile Image Upload</h3>
                            <div className="image-upload-container">
                                <div className={`image-preview-wrapper ${errors.image ? 'error' : ''}`} onClick={() => document.getElementById('image-upload').click()}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="profile-preview" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Camera size={48} />
                                            <span>Click to upload profile photo</span>
                                        </div>
                                    )}
                                </div>
                                {errors.image && <span className="error-text"><AlertCircle size={14}/> {errors.image}</span>}
                                <input id="image-upload" type="file" onChange={handleImageChange} hidden accept="image/*" />
                                <p className="upload-hint">Upload a clear photo to get 10x more responses.</p>
                            </div>
                            <div className="actions">
                                <button className="btn btn-outline" onClick={prevStep}><ChevronLeft size={18} /> Back</button>
                                <button className="btn btn-primary submit-btn" onClick={handleFinalSubmit} disabled={isUploading}>
                                    {isUploading ? 'Creating Profile...' : 'Complete & Create Profile'} <Save size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
