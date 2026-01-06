# HealthLink Frontend

A comprehensive healthcare management web application built with Next.js, providing interfaces for patients, doctors, and managers.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Application Routes

### Authentication & Registration
- `/auth/login` - General login page for all user types
- `/patient/auth/register` - Patient registration
- `/patient/auth/verify-email` - Email verification for patients
- `/manager/register` - Manager registration (wizard layout)
- `/register-manager` - Manager registration (clean layout)
- `/demo/manager-registration` - Manager registration demo page

### Patient Portal
- `/patient/dashboard` - Patient dashboard
- `/patient/visits` - Patient visit history
- `/patient/visits/create` - Schedule new appointment

### Doctor Portal
- `/doctor/overview` - Doctor dashboard

### Manager Portal
- `/manager` - Manager dashboard

### Testing & Development
- `/test-manager-api` - Manager API testing page

## Features

### Patient Features
- **Registration & Authentication**: Secure signup with email verification
- **Dashboard**: Overview of appointments, prescriptions, and health metrics
- **Appointment Management**: Schedule and manage healthcare visits
- **Medical History**: View past visits and treatments
- **Wallet Management**: Top-up and manage payment wallet
- **Notifications**: Real-time updates and reminders

### Doctor Features
- **Patient Queue Management**: View and manage daily patient queue
- **Consultation Tools**: Add notes and prescriptions during consultations
- **Earnings Tracking**: Monitor consultation fees and payments
- **Patient Charts**: Access detailed patient information

### Manager Features
- **Hospital Operations**: Comprehensive management dashboard
- **Staff Analytics**: Monitor doctor and staff performance
- **Inventory Management**: Track medical supplies and medications
- **Financial Reports**: Revenue and payment analytics
- **Queue Monitoring**: Real-time patient flow monitoring

## Manager Registration

The application provides multiple ways to register managers:

### 1. Wizard Layout (`/manager/register`)
- Multi-step registration process
- Step-by-step validation
- Progress indicator
- Enhanced user experience

### 2. Clean Layout (`/register-manager`)
- Single-page registration form
- Streamlined interface
- Quick registration process

### 3. Demo Page (`/demo/manager-registration`)
- Information about manager features
- Registration process overview
- Links to both registration layouts

### Manager Registration API Endpoints
- `POST /manager/api/healthlink/v1/register` - Submit manager registration
- `GET /manager/api/healthlink/v1/check-email/{email}` - Verify email availability
- `GET /manager/api/healthlink/v1/requirements` - Get registration requirements

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with shadcn/ui
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form with validation
- **HTTP Client**: Fetch API with custom wrappers
- **Icons**: Lucide React
- **Fonts**: Poppins (Google Fonts)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── patient/           # Patient portal pages
│   ├── doctor/            # Doctor portal pages
│   ├── manager/           # Manager portal pages
│   └── demo/              # Demo and testing pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── patient/          # Patient-specific components
│   ├── manager/          # Manager-specific components
│   └── doctor/           # Doctor-specific components
├── lib/                  # Utility functions and API clients
├── hooks/                # Custom React hooks
└── styles/               # Global styles and Tailwind config
```

## API Integration

The frontend integrates with the HealthLink Backend API running on `http://localhost:8081`. Key API endpoints include:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/patient/signup` - Patient registration
- `POST /api/auth/doctor/signup` - Doctor registration

### Manager Registration (New)
- `POST /manager/api/healthlink/v1/register` - Manager registration
- `GET /manager/api/healthlink/v1/check-email/{email}` - Email availability check
- `GET /manager/api/healthlink/v1/requirements` - Registration requirements

### Patient APIs
- `GET /api/patient/overview` - Dashboard data
- `GET /api/patient/appointments/me` - User appointments
- `POST /api/patient/appointments/me` - Create appointment

### Doctor APIs
- `GET /api/doctor/queue` - Patient queue
- `PATCH /api/doctor/queue/add-consultation/{id}` - Start consultation

### Manager APIs
- `GET /api/manager/overview` - Dashboard overview
- `GET /api/manager/queue-stats` - Queue statistics
- `GET /api/inventory` - Inventory management

## Development

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow consistent naming conventions
- Include proper error handling

### Testing
- Use the `/test-manager-api` page for API testing
- Test responsive design across devices
- Validate form inputs and error states

## Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy on Vercel
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

Create a `.env.local` file with:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

## Contributing

1. Follow the existing code style and patterns
2. Add proper TypeScript types for new features
3. Test new functionality thoroughly
4. Update documentation as needed

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/docs/) - JavaScript with syntax for types

---

This frontend application is designed to work seamlessly with the HealthLink Backend API and provides a comprehensive healthcare management solution for all user types.
