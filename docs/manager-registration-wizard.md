# Manager Registration Wizard

## Overview
A step-by-step registration form for managers to join the HealthLink system. The wizard breaks down the registration process into 5 manageable steps with a clean, user-friendly interface.

## Features

### 🎯 **Multi-Step Process**
- **Step 1**: Personal Information (Name, DOB, Gender)
- **Step 2**: Contact Information (Email, Phone, Country)
- **Step 3**: Identification (National ID)
- **Step 4**: Hospital Information (Hospital Name)
- **Step 5**: Security (Password Setup)

### ✨ **User Experience**
- **Progress Bar**: Visual progress indicator
- **Step Navigation**: Next/Back buttons with validation
- **Real-time Validation**: Immediate feedback on form errors
- **Email Availability**: Check if email is already registered
- **Responsive Design**: Works on desktop and mobile devices

### 🔒 **Security & Validation**
- **Client-side Validation**: Immediate feedback
- **Server-side Validation**: Secure backend validation
- **Password Confirmation**: Ensures password accuracy
- **Email Uniqueness**: Prevents duplicate registrations

## Usage

### 1. **Access the Registration Wizard**

#### Option A: Direct URL
```
http://localhost:3000/manager/register
```

#### Option B: Demo Page
```
http://localhost:3000/demo/manager-registration
```

### 2. **Step-by-Step Process**

#### Step 1: Personal Information
- Enter first name and last name
- Select date of birth
- Choose gender (Male/Female/Other)
- Click "Next" to proceed

#### Step 2: Contact Information
- Enter email address
- Click "Check" to verify email availability
- Enter phone number (with country code)
- Enter country of residence
- Click "Next" to continue

#### Step 3: Identification
- Enter national ID number
- Click "Next" to proceed

#### Step 4: Hospital Information
- Enter the name of the hospital to manage
- Click "Next" to continue

#### Step 5: Security
- Create a password (minimum 8 characters)
- Confirm the password
- Click "Create Account" to complete registration

### 3. **Navigation**
- **Next Button**: Proceeds to next step (disabled until current step is valid)
- **Back Button**: Returns to previous step
- **Progress Bar**: Shows completion percentage
- **Step Indicators**: Visual representation of current step

## Components

### Main Component
```typescript
import ManagerRegistrationWizard from "@/components/manager/ManagerRegistrationWizard";

export default function RegisterPage() {
  return <ManagerRegistrationWizard />;
}
```

### Individual Step Components
- `PersonalInfoStep`: Handles personal information
- `ContactInfoStep`: Manages contact details with email validation
- `IdentificationStep`: Collects identification information
- `HospitalInfoStep`: Gathers hospital information
- `SecurityStep`: Handles password creation

## API Integration

### Endpoints Used
- **POST** `/manager/api/healthlink/v1/register` - Submit registration
- **GET** `/manager/api/healthlink/v1/check-email/{email}` - Check email availability

### Data Flow
1. User fills out form step by step
2. Each step validates input before allowing progression
3. Email availability is checked in real-time
4. Final step submits all data to registration endpoint
5. Success/error feedback is provided to user

## Validation Rules

### Personal Information
- First name: 2-50 characters, required
- Last name: 2-50 characters, required
- Date of birth: Valid date, age 18-100, required
- Gender: Must be MALE, FEMALE, or OTHER, required

### Contact Information
- Email: Valid email format, must be unique, required
- Phone: Valid international format, required
- Country: Required

### Identification
- National ID: Required

### Hospital Information
- Hospital name: Required

### Security
- Password: Minimum 8 characters, required
- Confirm password: Must match password, required

## Styling & Design

### Theme
- **Primary Colors**: Blue gradient background
- **Step Colors**: Different colored icons for each step
- **Success States**: Green indicators for completed steps
- **Error States**: Red borders and text for validation errors

### Responsive Design
- **Desktop**: Full-width cards with side-by-side navigation
- **Mobile**: Stacked layout with full-width buttons
- **Progress Bar**: Adapts to screen size

### Icons
- **Personal Info**: User icon
- **Contact**: Mail icon
- **Identification**: Calendar icon
- **Hospital**: Building icon
- **Security**: Lock icon

## Error Handling

### Client-Side Errors
- Required field validation
- Format validation (email, phone)
- Password matching
- Age validation

### Server-Side Errors
- Email already exists
- Registration failure
- Network errors

### User Feedback
- Toast notifications for success/error states
- Inline error messages for form fields
- Loading states during API calls

## Customization

### Adding New Steps
1. Create new step component following the `StepProps` interface
2. Add to the `steps` array in the main wizard
3. Update validation logic in `validateCurrentStep()`

### Modifying Validation
- Update `validateRegistrationData()` in the API library
- Modify step-specific validation in `validateCurrentStep()`
- Adjust backend validation rules

### Styling Changes
- Modify Tailwind classes in component files
- Update color schemes in step indicators
- Customize card layouts and spacing

## Testing

### Manual Testing Checklist
- [ ] All steps can be navigated forward and backward
- [ ] Validation prevents progression with invalid data
- [ ] Email availability check works correctly
- [ ] Password confirmation validation works
- [ ] Registration submission succeeds with valid data
- [ ] Error handling displays appropriate messages
- [ ] Responsive design works on different screen sizes

### Test Data
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@test.com",
  "countryOfResidence": "Rwanda",
  "phoneNumber": "+250788123456",
  "password": "testPassword123",
  "confirmPassword": "testPassword123",
  "nationalId": "1234567890123456",
  "dateOfBirth": "1985-05-15",
  "gender": "MALE",
  "hospitalName": "Test Hospital"
}
```

## Troubleshooting

### Common Issues

#### Email Check Not Working
- Verify backend endpoint is running
- Check network connectivity
- Ensure email format is valid

#### Registration Fails
- Check all required fields are filled
- Verify password meets requirements
- Ensure email is available
- Check backend logs for errors

#### Navigation Issues
- Ensure validation passes before clicking Next
- Check for JavaScript errors in console
- Verify all required components are imported

### Debug Mode
Add console logs to track form state:
```typescript
console.log('Current step:', currentStep);
console.log('Form data:', formData);
console.log('Validation errors:', errors);
```

## Future Enhancements

### Potential Improvements
- **Save Progress**: Allow users to save and resume registration
- **File Upload**: Add profile picture upload
- **Hospital Selection**: Dropdown of existing hospitals
- **Department Assignment**: Select specific departments to manage
- **Terms & Conditions**: Add acceptance step
- **Email Verification**: Send verification email before activation
- **Multi-language Support**: Internationalization
- **Accessibility**: Enhanced screen reader support

### Integration Opportunities
- **SSO Integration**: Single sign-on with existing systems
- **Hospital Database**: Integration with hospital registry
- **Background Checks**: Automated verification processes
- **Onboarding Flow**: Post-registration setup wizard