import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAuth from '../../hooks/useAuth';
import { FaCloudUploadAlt, FaExclamationTriangle, FaImage, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import { MdTitle, MdCategory, MdCalendarMonth, MdDescription } from 'react-icons/md';
import { IoMdPricetag } from 'react-icons/io';

const currentYear = new Date().getFullYear();

const UpdateBook = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [bookData, setBookData] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm();

    const basePrice = parseFloat(watch('basePrice')) || 0;
    const editionYear = parseInt(watch('editionYear')) || currentYear;

    const getAdjustedPrice = (base, year) => {
        const age = currentYear - year;
        if (age <= 0) return base * 0.85;
        if (age === 1) return base * 0.7;

        const depreciationFirstYear = base * 0.3;
        const depreciationSubsequentYears = base * 0.1 * (age - 1);
        const finalPrice = base - depreciationFirstYear - depreciationSubsequentYears;

        return finalPrice <= base * 0.1
            ? (base * 0.1).toFixed(2)
            : finalPrice.toFixed(2);
    };


    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const res = await axiosPublic.get(`/books/${id}`);
                if (res.data) {
                    setBookData(res.data);
                    setValue('title', res.data.title);
                    setValue('author', res.data.author);
                    setValue('genre', res.data.genre);
                    setValue('condition', res.data.condition);
                    setValue('editionYear', res.data.editionYear);
                    setValue('basePrice', res.data.basePrice);
                    setValue('phone', res.data.phone);
                    setValue('location', res.data.location);
                    setValue('description', res.data.description);
                    setImagePreview(res.data.image);
                    setValue('image', res.data.image);
                }
            } catch (error) {
                console.error('Error fetching book data:', error);
                Swal.fire('Error', 'Failed to fetch book data', 'error');
                navigate('/');
            }
        };
        fetchBookData();
    }, [id, axiosPublic, setValue, navigate]);
   

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                setImageError('Only image files are allowed.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setImageError('Image size must be less than 5MB');
                return;
            }
            setImageError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (imageFile) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await axiosPublic.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setIsUploading(false);
        return response.data.data.url;
    };

    const onSubmit = async (data) => {
        try {
            let imageUrl = bookData.image;
            const newFile = fileInputRef.current?.files?.[0];
            if (newFile) {
                imageUrl = await uploadImage(newFile);
            }

            const updatedBook = {
                ...data,
                image: imageUrl,
                finalPrice: getAdjustedPrice(parseFloat(data.basePrice), parseInt(data.editionYear)),
                ownerName: user?.displayName || 'Anonymous',
                ownerImage: user?.photoURL || '/default-avatar.png',
                ownerEmail: user?.email,
                timestamp: new Date()
            };

            const res = await axiosPublic.put(`/books/${id}`, updatedBook);

            if (res.data.modifiedCount > 0) {
                Swal.fire('Success', 'Book updated successfully', 'success');
                navigate('/');
            }
            else {
                Swal.fire('Info', 'No changes detected', 'info');
            }
        }
        catch (err) {
            console.error(err);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    if (!bookData) return <div className="text-center py-10">Loading book info...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-white flex items-center justify-center py-10 px-2">
      <div className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl bg-white overflow-hidden border border-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-500 px-8 py-7 flex flex-col items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Update Your Book
          </h1>
          <p className="text-indigo-100 text-center text-base max-w-xl mt-1">
            Update the details of your book post. Make sure to provide accurate information.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10 space-y-8">
          {/* Book Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <MdTitle className="mr-2 text-indigo-500" /> Book Name
              </label>
              <input
                type="text"
                placeholder="Enter book name"
                defaultValue={bookData.title}
                {...register('title', { required: 'Book name is required' })}
                className={`input input-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <MdTitle className="mr-2 text-indigo-500" /> Author Name
              </label>
              <input
                type="text"
                placeholder="Enter author name"
                defaultValue={bookData.author}
                {...register('author', { required: 'Author name is required' })}
                className={`input input-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.author ? 'border-red-500' : ''}`}
              />
              {errors.author && <p className="text-red-500 text-xs">{errors.author.message}</p>}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-semibold text-sm">
              <FaImage className="mr-2 text-indigo-500" /> Book Image <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer hover:border-indigo-400 transition bg-indigo-50/40">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaCloudUploadAlt className="w-10 h-10 mb-2 text-indigo-400" />
                    <p className="mb-1 text-sm text-indigo-700 font-medium">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-indigo-400">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 flex items-center justify-center">
                {imagePreview ? (
                  <div className="h-44 w-full flex items-center justify-center border rounded-xl overflow-hidden bg-white shadow">
                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="h-44 w-full flex items-center justify-center border rounded-xl bg-indigo-50 text-indigo-300">
                    <p>No image selected</p>
                  </div>
                )}
              </div>
            </div>
            {imageError && (
              <div className="flex items-center text-red-500 text-xs mt-1">
                <FaExclamationTriangle className="mr-1" />
                {imageError}
              </div>
            )}
          </div>

          {/* Genre & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <MdCategory className="mr-2 text-indigo-500" /> Book Genre
              </label>
              <select
                {...register('genre', { required: 'Book genre is required' })}
                defaultValue={bookData.genre}
                className={`select select-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.genre ? 'border-red-500' : ''}`}
              >
                <option value="">Select Genre</option>
                <option>Fiction</option>
                <option>Non-fiction</option>
                <option>Fantasy</option>
                <option>Mystery</option>
                <option>Biography</option>
                <option>Science</option>
                <option>Drama</option>
              </select>
              {errors.genre && <p className="text-red-500 text-xs">{errors.genre.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <MdCategory className="mr-2 text-indigo-500" /> Book Condition
              </label>
              <select
                {...register('condition', { required: 'Category is required' })}
                defaultValue={bookData.condition}
                className={`select select-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.condition ? 'border-red-500' : ''}`}
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Used">Used</option>
                <option value="Worn">Worn</option>
              </select>
              {errors.condition && <p className="text-red-500 text-xs">{errors.condition.message}</p>}
            </div>
          </div>

          {/* Edition Year & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <MdCalendarMonth className="mr-2 text-indigo-500" /> Edition Year
              </label>
              <select
                {...register('editionYear', { required: true, min: 2000, max: currentYear })}
                defaultValue={bookData.editionYear}
                className={`select select-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.editionYear ? 'border-red-500' : ''}`}
              >
                <option value="">Select Edition Year</option>
                {[...Array(currentYear - 1999)].map((_, index) => {
                  const year = currentYear - index;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
              {errors.editionYear && <p className="text-red-500 text-xs">{errors.editionYear.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <IoMdPricetag className="mr-2 text-indigo-500" /> Base Price (BDT)
              </label>
              <input
                {...register('basePrice', {
                  required: 'Base price is required',
                  min: { value: 0, message: 'Base price must be at least 0' }
                })}
                type="number"
                step="0.01"
                defaultValue={bookData.basePrice}
                placeholder="Base Price (BDT)"
                className={`input input-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.basePrice ? 'border-red-500' : ''}`}
              />
              {errors.basePrice && <p className="text-red-500 text-xs">{errors.basePrice.message}</p>}
              <div className="text-right text-xs text-gray-500 italic mt-1">
                Final Price:{' '}
                <span className="text-indigo-600 font-semibold">
                  BDT {getAdjustedPrice(basePrice, editionYear)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <FaPhone className="mr-2 text-indigo-500" /> Contact Number
              </label>
              <input
                type="tel"
                placeholder="Your phone number for contact"
                {...register('phone', { required: 'Phone number is required' })}
                defaultValue={bookData.phone}
                className={`input input-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <FaMapMarkerAlt className="mr-2 text-indigo-500" /> Location
              </label>
              <input
                type="text"
                placeholder="Where are you located?"
                defaultValue={bookData.location}
                {...register('location', { required: 'Location is required' })}
                className={`input input-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.location ? 'border-red-500' : ''}`}
              />
              {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="flex items-center text-gray-700 font-semibold text-sm">
              <MdDescription className="mr-2 text-indigo-500" /> Description
            </label>
            <textarea
              rows="4"
              placeholder="Provide a detailed description of the book and its condition..."
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 20, message: 'Description should be at least 20 characters' }
              })}
              defaultValue={bookData.description}
              className={`textarea textarea-bordered w-full focus:ring-2 focus:ring-indigo-400 ${errors.description ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`btn btn-primary w-full rounded-xl shadow-md transition-all duration-150 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-indigo-600 to-blue-500 border-0 text-white text-lg font-semibold tracking-wide ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={isUploading}
            >
              {isUploading ? 'Updating...' : 'Update Book Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
    );
};

export default UpdateBook;
