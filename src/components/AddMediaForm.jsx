import { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { addMedia, updateMedia } from "../api/mediaService";
import Spinner from "./common/Spinner.jsx";
import toast from "react-hot-toast";
// --- UPDATED IMPORT ---
// We import the map instead of the old list to fix the crash
import { COMPANIES, COMPANY_MEDIA_MAP } from '../constants.js';

// --- Styled Components (No changes) ---
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Label = styled.label`
  font-weight: 500;
  color: #d1d5db;
  font-size: 0.95rem;
`;
const HelperText = styled.span`
  color: #9ca3af;
  font-size: 0.85rem;
  margin-top: 4px;
`;
const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  color: #f9fafb;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  transition: all 0.2s;
  &::placeholder {
    color: #6b7280;
  }
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  &:disabled {
    background: #1f2937;
    color: #6b7280;
    cursor: not-allowed;
  }
  &[aria-invalid="true"] {
    border-color: #ef4444;
  }
`;
const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const CustomFileInput = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-weight: 500;
  color: #f3f4f6;
  background: #4b5563;
  border-radius: 8px;
  cursor: pointer;
  input[type="file"] {
    display: none;
  }
`;
const FileName = styled.span`
  color: #9ca3af;
  font-size: 0.9rem;
  word-break: break-all;
`;
const Button = styled.button`
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #16a34a;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  &:disabled {
    background: #4b5563;
    opacity: 0.5;
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 1rem;
  color: #F9FAFB;
  background-color: #374151;
  border: 1px solid #4B5563;
  border-radius: 8px;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  &:disabled {
    background-color: #1F2937;
    color: #6B7280;
    cursor: not-allowed;
  }
`;

const AddMediaForm = ({ onSuccess, onCancel, mediaToEdit }) => {
  const isEditMode = !!mediaToEdit;

  const initialFormState = {
    belongsTo: "",
    mediaCode: "",
    location: "",
    city: "",
    specifications: "",
    illumination: "",
    mediaType: "",
    trafficView: "",
    locationUrl: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // --- NEW LOGIC ---
  // Calculate which media types are allowed based on the selected company
  const availableMediaTypes = useMemo(() => {
    if (!formData.belongsTo) return [];
    return COMPANY_MEDIA_MAP[formData.belongsTo] || [];
  }, [formData.belongsTo]);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        belongsTo: mediaToEdit.belongsTo || "",
        mediaCode: mediaToEdit.mediaCode || "",
        location: mediaToEdit.location || "",
        city: mediaToEdit.city || "",
        specifications: mediaToEdit.specifications || "",
        illumination: mediaToEdit.illumination || "",
        mediaType: mediaToEdit.mediaType || "",
        trafficView: mediaToEdit.trafficView || "",
        locationUrl: mediaToEdit.locationUrl || "",
      });
    } else {
      setFormData(initialFormState);
    }
    setImageFile(null);
    setSelectedFileName("");
    setErrors({});
  }, [mediaToEdit, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      // If user changes Company, clear the Media Type if it's no longer valid
      if (name === 'belongsTo') {
        return { ...prev, [name]: value, mediaType: '' };
      }
      return { ...prev, [name]: value };
    });

    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setImageFile(f);
      setSelectedFileName(f.name);
      if (errors.image) setErrors((p) => ({ ...p, image: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!formData.belongsTo) newErrors.belongsTo = "Company is required";
    if (!formData.mediaCode) newErrors.mediaCode = "Media code is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.trafficView) newErrors.trafficView = "Traffic view is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.specifications) newErrors.specifications = "Specifications are required";
    if (!formData.mediaType) newErrors.mediaType = "Media type is required";
    if (!isEditMode && !imageFile) {
      newErrors.image = "An image file is required";
      toast.error("Please select an image file.");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (isEditMode) {
        await updateMedia(mediaToEdit.id, data);
        toast.success("Media item updated successfully!");
      } else {
        await addMedia(data);
        toast.success("Media item added successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("Form submission failed:", err);
      toast.error(
        isEditMode ? "Failed to update media." : "Failed to add media."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        {isEditMode ? "Edit Media" : "Add New Media"}
      </h2>
      <Form onSubmit={handleSubmit}>
        <FormGrid>
          {/* Company Selection */}
          <FormGroup>
            <Label htmlFor="belongsTo">Company</Label>
            <Select
              id="belongsTo"
              name="belongsTo"
              value={formData.belongsTo}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select a company...</option>
              {COMPANIES.map(company => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </Select>
            {errors.belongsTo && (
              <HelperText style={{ color: "#EF4444" }}>
                {errors.belongsTo}
              </HelperText>
            )}
          </FormGroup>

          {/* Media Type Selection (Filtered dynamically) */}
          <FormGroup>
            <Label htmlFor="mediaType">Media Type</Label>
            <Select
              id="mediaType"
              name="mediaType"
              value={formData.mediaType}
              onChange={handleInputChange}
              required
              disabled={!formData.belongsTo} // Disable until company is picked
            >
              <option value="" disabled>
                {formData.belongsTo ? "Select a type..." : "Select Company first..."}
              </option>
              {availableMediaTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            {errors.mediaType && (
              <HelperText style={{ color: "#EF4444" }}>{errors.mediaType}</HelperText>
            )}
          </FormGroup>

          {/* Standard Fields */}
          <FormGroup>
            <Label htmlFor="mediaCode">Media Code</Label>
            <Input
              id="mediaCode"
              name="mediaCode"
              value={formData.mediaCode}
              onChange={handleInputChange}
              required
            />
            {errors.mediaCode && (
              <HelperText style={{ color: "#EF4444" }}>{errors.mediaCode}</HelperText>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            {errors.location && (
              <HelperText style={{ color: "#EF4444" }}>{errors.location}</HelperText>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="locationUrl">Location URL (Optional)</Label>
            <Input
              id="locationUrl"
              name="locationUrl"
              value={formData.locationUrl}
              onChange={handleInputChange}
              placeholder="e.g., https://maps.app.goo.gl/..."
            />
             <HelperText>Link to the location on Google Maps.</HelperText>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="trafficView">Traffic View</Label>
            <Input
              id="trafficView"
              name="trafficView"
              value={formData.trafficView}
              onChange={handleInputChange}
              required
            />
            {errors.trafficView && (
              <HelperText style={{ color: "#EF4444" }}>{errors.trafficView}</HelperText>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            {errors.city && (
              <HelperText style={{ color: "#EF4444" }}>{errors.city}</HelperText>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="specifications">Specifications</Label>
            <Input
              id="specifications"
              name="specifications"
              value={formData.specifications}
              onChange={handleInputChange}
              required
            />
            {errors.specifications && (
              <HelperText style={{ color: "#EF4444" }}>{errors.specifications}</HelperText>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="illumination">Illumination</Label>
            <Input
              id="illumination"
              name="illumination"
              value={formData.illumination}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>{isEditMode ? "Replace Image (Optional)" : "Image"}</Label>
            <FileInputWrapper>
              <CustomFileInput>
                Choose File
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </CustomFileInput>
              <FileName>
                {selectedFileName ||
                  (isEditMode ? "No new file chosen" : "No file chosen")}
              </FileName>
              {errors.image && (
                <HelperText style={{ color: "#EF4444" }}>{errors.image}</HelperText>
              )}
            </FileInputWrapper>
          </FormGroup>
        </FormGrid>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <Button
            type="button"
            onClick={onCancel}
            style={{ backgroundColor: "#4B5563" }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Spinner size={16} /> {isEditMode ? "Saving..." : "Adding..."}
              </span>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Add Media"
            )}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AddMediaForm;