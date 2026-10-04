import { useState, useEffect } from 'react'
import {
  Search,
  BriefcaseBusiness,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Users,
  Globe2,
  X,
  UserPlus,
  CheckCircle2,
  Mail
} from 'lucide-react'

function App() {
const [form, setForm] = useState({
  name: '',
  email: '',
  phone: '',
  country: '',
  password: ''
})

  const [showRegister, setShowRegister] = useState(false)

const [showLogin, setShowLogin] = useState(false)

const [loginForm, setLoginForm] = useState({ email: '', password: '' })

const [loginLoading, setLoginLoading] = useState(false)

const [loginMessage, setLoginMessage] = useState('')

const [loggedInUser, setLoggedInUser] = useState(null)

const [showDashboard, setShowDashboard] = useState(false)

const [applications, setApplications] = useState([])
const [applicationsLoading, setApplicationsLoading] = useState(false)
const [showAdminDashboard, setShowAdminDashboard] = useState(false)
const [adminApplications, setAdminApplications] = useState([])
const [adminLoading, setAdminLoading] = useState(false)

const [selectedJob, setSelectedJob] = useState(null)

const [applicationJob, setApplicationJob] = useState(null)
const [jobSearch, setJobSearch] = useState('')
const [jobCategory, setJobCategory] = useState('All Categories')
const [jobLocation, setJobLocation] = useState('All Locations')

const [showApplication, setShowApplication] = useState(false)

const [registered, setRegistered] = useState(false)

const [loading, setLoading] = useState(false)
const [showJobForm, setShowJobForm] = useState(false);
  const [message, setMessage] = useState('')
  
useEffect(() => {
  const token = localStorage.getItem('careerlinkToken')
  if (!token) return

  fetch('https://luxembourg-careerlink-api.onrender.com/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      setLoggedInUser(data.user)

      if (data.user.role === 'admin') {
        setShowAdminDashboard(true)
      }
    })
    .catch(() => localStorage.removeItem('careerlinkToken'))
}, [])
   

  useEffect(() => {
    if (showDashboard && loggedInUser) {
      loadApplications()
    }
  }, [showDashboard, loggedInUser])



  const jobs = [

  // 1. TRANSPORT & LOGISTICS
  {
    title: 'Delivery Driver',
    category: 'Transport & Logistics',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['Driving experience', 'Valid licence'],
  },
  {
    title: 'Transport Assistant',
    category: 'Transport & Logistics',
    salary: '€2,100 - €2,500',
    location: 'Luxembourg',
    requirements: ['Good physical condition', 'Basic English'],
  },
  {
    title: 'Logistics Assistant',
    category: 'Transport & Logistics',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['Organizational skills', 'Basic computer knowledge'],
  },

  // 2. HOSPITALITY & TOURISM
  {
    title: 'Hotel Receptionist',
    category: 'Hospitality & Tourism',
    salary: '€2,200 - €2,600',
    location: 'Luxembourg',
    requirements: ['Guest service skills', 'Basic English'],
  },
  {
    title: 'Waiter/Waitress',
    category: 'Hospitality & Tourism',
    salary: '€2,100 - €2,500',
    location: 'Luxembourg',
    requirements: ['Customer service', 'Willing to learn'],
  },
  {
    title: 'Kitchen Assistant',
    category: 'Hospitality & Tourism',
    salary: '€2,100 - €2,500',
    location: 'Luxembourg',
    requirements: ['Basic kitchen skills', 'Team player'],
  },

  // 3. HEALTHCARE & CAREGIVING
  {
    title: 'Caregiver',
    category: 'Healthcare & Caregiving',
    salary: '€2,400 - €2,800',
    location: 'Luxembourg',
    requirements: ['Care experience', 'Relevant training'],
  },
  {
    title: 'Healthcare Assistant',
    category: 'Healthcare & Caregiving',
    salary: '€2,400 - €2,900',
    location: 'Luxembourg',
    requirements: ['Healthcare training', 'Good communication'],
  },
  {
    title: 'Support Worker',
    category: 'Healthcare & Caregiving',
    salary: '€2,300 - €2,700',
    location: 'Luxembourg',
    requirements: ['Compassion', 'Team work'],
  },

  // 4. CONSTRUCTION & TRADES
  {
    title: 'Construction Worker',
    category: 'Construction & Trades',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['Physical fitness', 'Willing to learn'],
  },
  {
    title: 'Carpenter',
    category: 'Construction & Trades',
    salary: '€2,400 - €2,900',
    location: 'Luxembourg',
    requirements: ['Carpentry skills', 'Work experience'],
  },
  {
    title: 'Painter',
    category: 'Construction & Trades',
    salary: '€2,300 - €2,800',
    location: 'Luxembourg',
    requirements: ['Painting skills', 'Attention to detail'],
  },
  {
    title: 'Welder',
    category: 'Construction & Trades',
    salary: '€2,500 - €3,000',
    location: 'Luxembourg',
    requirements: ['Welding skills', 'Safety awareness'],
  },

  // 5. SECURITY
  {
    title: 'Security Guard',
    category: 'Security',
    salary: '€2,100 - €2,500',
    location: 'Luxembourg',
    requirements: ['Good physical condition', 'Vigilant'],
  },
  {
    title: 'Security Assistant',
    category: 'Security',
    salary: '€2,100 - €2,500',
    location: 'Luxembourg',
    requirements: ['Observation skills', 'Basic English'],
  },

  // 6. CLEANING & FACILITIES
  {
    title: 'Cleaner',
    category: 'Cleaning & Facilities',
    salary: '€2,000 - €2,400',
    location: 'Luxembourg',
    requirements: ['No experience', 'Willing to learn'],
  },
  {
    title: 'Housekeeping Attendant',
    category: 'Cleaning & Facilities',
    salary: '€2,100 - €2,500',
    location: 'Luxembourg',
    requirements: ['Housekeeping experience preferred'],
  },
  {
    title: 'Maintenance Assistant',
    category: 'Cleaning & Facilities',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['Basic maintenance skills', 'Handy with tools'],
  },

  // 7. OFFICE & ADMINISTRATION
  {
    title: 'Administrative Assistant',
    category: 'Office & Administration',
    salary: '€2,400 - €2,900',
    location: 'Luxembourg',
    requirements: ['Office experience', 'Good communication'],
  },
  {
    title: 'Office Assistant',
    category: 'Office & Administration',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['Basic computer skills', 'Organized'],
  },
  {
    title: 'Customer Service Assistant',
    category: 'Office & Administration',
    salary: '€2,300 - €2,800',
    location: 'Luxembourg',
    requirements: ['Customer service experience', 'Good communication'],
  },

  // 8. IT & DIGITAL
  {
    title: 'IT Support Assistant',
    category: 'IT & Digital',
    salary: '€2,600 - €3,200',
    location: 'Luxembourg',
    requirements: ['Basic IT skills', 'Troubleshooting knowledge'],
  },
  {
    title: 'Computer Technician',
    category: 'IT & Digital',
    salary: '€2,600 - €3,200',
    location: 'Luxembourg',
    requirements: ['Hardware & software knowledge'],
  },
  {
    title: 'Data Entry Clerk',
    category: 'IT & Digital',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['Typing speed', 'Accuracy', 'Basic computer skills'],
  },

  // 9. RETAIL & SALES
  {
    title: 'Sales Assistant',
    category: 'Retail & Sales',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['Sales experience preferred', 'Good communication'],
  },
  {
    title: 'Cashier',
    category: 'Retail & Sales',
    salary: '€2,100 - €2,500',
    location: 'Luxembourg',
    requirements: ['Basic math skills', 'Customer friendly'],
  },
  {
    title: 'Shop Assistant',
    category: 'Retail & Sales',
    salary: '€2,100 - €2,600',
    location: 'Luxembourg',
    requirements: ['Retail experience preferred', 'Willing to learn'],
  },

  // 10. MANUFACTURING & PRODUCTION
  {
    title: 'Production Worker',
    category: 'Manufacturing & Production',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['No experience', 'Willing to learn'],
  },
  {
    title: 'Machine Operator',
    category: 'Manufacturing & Production',
    salary: '€2,400 - €2,900',
    location: 'Luxembourg',
    requirements: ['Machine operation experience preferred'],
  },
  {
    title: 'Packaging Operator',
    category: 'Manufacturing & Production',
    salary: '€2,100 - €2,500',
    location: 'Luxembourg',
    requirements: ['Attention to detail', 'Physical stamina'],
  },

  // 11. AGRICULTURE & LANDSCAPING
  {
    title: 'Farm Worker',
    category: 'Agriculture & Landscaping',
    salary: '€2,000 - €2,400',
    location: 'Luxembourg',
    requirements: ['No experience', 'Hardworking & reliable'],
  },
  {
    title: 'Gardener',
    category: 'Agriculture & Landscaping',
    salary: '€2,100 - €2,600',
    location: 'Luxembourg',
    requirements: ['Gardening experience preferred'],
  },
  {
    title: 'Landscaping Assistant',
    category: 'Agriculture & Landscaping',
    salary: '€2,200 - €2,700',
    location: 'Luxembourg',
    requirements: ['Basic landscaping skills', 'Physically fit'],
  },
]
const filteredJobs = jobs.filter((job) => {
  const search = jobSearch.toLowerCase().trim()

  const matchesSearch =
    !search ||
    job.title.toLowerCase().includes(search) ||
    job.category.toLowerCase().includes(search)

  const matchesCategory =
    jobCategory === 'All Categories' ||
    job.category === jobCategory

  const matchesLocation =
    jobLocation === 'All Locations' ||
    job.location === jobLocation

  return matchesSearch && matchesCategory && matchesLocation
})
  function openLogin() {
    setLoginMessage('')
    setShowLogin(true)
  }

  function closeLogin() {
    if (!loginLoading) {
      setShowLogin(false)
      setLoginMessage('')
    }
  }

  function handleLoginChange(e) {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginMessage('')

    try {
      const response = await fetch('https://luxembourg-careerlink-api.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await response.json()

      if (!response.ok) {
        setLoginMessage(data.message || 'Login failed.')
        return
      }

     localStorage.setItem('careerlinkToken', data.token)
setLoggedInUser(data.user)

if (data.user.role === 'admin') {
  setShowAdminDashboard(true)
  setShowDashboard(false)
  loadAdminApplications()
} else {
  setShowDashboard(true)
  setShowAdminDashboard(false)
}

setLoginForm({ email: '', password: '' })
setShowLogin(false)
    } catch {
      setLoginMessage('Unable to connect. Please make sure the backend is running.')
    } finally {
      setLoginLoading(false)
    }
  }

 function handleLogout() {
  localStorage.removeItem('careerlinkToken')
  setLoggedInUser(null)
  setShowDashboard(false)
}
async function loadApplications() {
  try {
    setApplicationsLoading(true)

    const token = localStorage.getItem('careerlinkToken')

    const response = await fetch(
      'https://luxembourg-careerlink-api.onrender.com/api/applications',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Unable to load applications.')
    }

    setApplications(data.applications || [])
  } catch (error) {
    console.error(error)
  } finally {
    setApplicationsLoading(false)
  }
}

useEffect(() => {
  if (showDashboard && loggedInUser) {
    loadApplications()
  }
}, [showDashboard, loggedInUser])
  async function loadAdminApplications() {
  try {
    setAdminLoading(true)

    const token = localStorage.getItem('careerlinkToken')

    const response = await fetch(
      'https://luxembourg-careerlink-api.onrender.com/api/admin/applications',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || 'Unable to load recruitment applications.'
      )
    }

    setAdminApplications(data.applications || [])
  } catch (error) {
    console.error(error)
    alert(error.message)
  } finally {
    setAdminLoading(false)
  }
}

  function openRegister() {
    setShowRegister(true)
    setRegistered(false)
    setMessage('')
  }

  function closeRegister() {
    if (!loading) {
      setShowRegister(false)
      setMessage('')
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleRegister(e) {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('https://luxembourg-careerlink-api.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Registration failed.')
        setLoading(false)
        return
      }

      setRegistered(true)
      setMessage(data.message)

      setForm({
        name: '',
        email: '',
        phone: '',
        country: '',
        password: '',
      })
    } catch (error) {
      setMessage(
        'Unable to connect to the server. Please make sure the backend is running.'
      )
    }

   setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {showApplication && applicationJob && loggedInUser && (
  <div className="fixed inset-0 z-[95] overflow-y-auto bg-slate-50">
    <div className="mx-auto max-w-3xl px-6 py-10">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Luxembourg CareerLink
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Application
          </h2>
        </div>

        <button
          onClick={() => {
            setShowApplication(false)
            setSelectedJob(applicationJob)
          }}
          className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-white"
        >
          Back
        </button>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Selected Position
          </p>

          <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
            {applicationJob.title}
          </h3>

          <p className="mt-2 text-slate-500">
            {applicationJob.category} • {applicationJob.location}
          </p>

          <p className="mt-3 font-bold text-slate-900">
            {applicationJob.salary} / month
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-5">
          <h4 className="font-bold text-slate-900">
            Applicant Information
          </h4>

          <div className="mt-4 space-y-2 text-slate-600">
            <p>
              <strong>Name:</strong> {loggedInUser.name}
            </p>

            <p>
              <strong>Email:</strong> {loggedInUser.email}
            </p>

            <p>
              <strong>Phone:</strong> {loggedInUser.phone}
            </p>

            <p>
              <strong>Country:</strong> {loggedInUser.country}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-bold text-slate-900">
            Application Process
          </h4>

          <p className="mt-3 leading-7 text-slate-600">
            Your application will be reviewed by the Luxembourg CareerLink
            recruitment team. You will be contacted with instructions on
            the required CV and supporting documents.
          </p>
        </div>

                <div className="mt-8 flex gap-4">
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem('careerlinkToken')

                const response = await fetch(
                  'https://luxembourg-careerlink-api.onrender.com/api/applications',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      jobTitle: applicationJob.title,
                      category: applicationJob.category,
                      salary: applicationJob.salary,
                      location: applicationJob.location,
                    }),
                  }
                )

                const data = await response.json()

                if (!response.ok) {
                  alert(data.message || 'Unable to submit application.')
                  return
                }

               

                setShowApplication(false)
                setSelectedJob(null)
                setShowDashboard(true)
                loadApplications()
              } catch (error) {
                console.error(error)
                alert('Unable to connect to the application server.')
              }
            }}
            className="flex-1 rounded-lg bg-blue-700 px-5 py-3.5 font-bold text-white hover:bg-blue-800"
          >
            Confirm Application
          </button>

          <button
            onClick={() => {
              setShowApplication(false)
              setSelectedJob(applicationJob)
            }}
            className="rounded-lg border border-slate-300 px-5 py-3.5 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  </div>
)}
      {selectedJob && (
  <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4">
    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">

      <button
        type="button"
        onClick={() => setSelectedJob(null)}
        className="absolute right-4 top-4 rounded-full px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
      >
        ×
      </button>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <BriefcaseBusiness size={24} />
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-blue-700">
        {selectedJob.category}
      </p>

      <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
        {selectedJob.title}
      </h2>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <MapPin size={17} />
          {selectedJob.location}
        </span>

        <span className="font-bold text-slate-900">
          {selectedJob.salary} / month
        </span>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-7">

        <h3 className="text-lg font-extrabold">
          Job Description
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          We are looking for a reliable and motivated professional to join
          our recruitment opportunities in Luxembourg. The successful
          candidate will perform the responsibilities associated with the
          position while maintaining professional standards and workplace
          procedures.
        </p>

        <h3 className="mt-7 text-lg font-extrabold">
          Requirements
        </h3>

       <ul className="mt-3 space-y-2 text-slate-600">
  {selectedJob.requirements.map((requirement, index) => (
    <li key={index}>• {requirement}</li>
  ))}
</ul>

        <h3 className="mt-7 text-lg font-extrabold">
          Application Process
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          Create an account, review the position requirements, and contact
          our recruitment team through WhatsApp for instructions on the
          next steps and required documents.
        </p>

      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            if (!loggedInUser) {
              openLogin()
              return
            }

            setApplicationJob(selectedJob)
            setSelectedJob(null)
            setShowApplication(true)
          }}
          className="flex-1 rounded-lg bg-blue-700 px-5 py-3.5 text-center font-semibold text-white hover:bg-blue-800"
        >
          Apply Now
        </button>

        <button
          type="button"
          onClick={() => setSelectedJob(null)}
          className="rounded-lg border border-slate-300 px-5 py-3.5 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900">
              LUXEMBOURG <span className="text-blue-700">CAREERLINK</span>
            </div>

            <div className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">
              S.A R.L.
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#jobs" className="text-sm font-medium hover:text-blue-700">
              Find Jobs
            </a>

            <a href="#process" className="text-sm font-medium hover:text-blue-700">
              How It Works
            </a>

            <a href="#about" className="text-sm font-medium hover:text-blue-700">
              About Us
            </a>

            <a href="#contact" className="text-sm font-medium hover:text-blue-700">
              Contact
            </a>
          </nav>

                    <div className="flex items-center gap-3">
            {loggedInUser ? (
              <>
                {loggedInUser.role !== 'admin' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDashboard(true)
                        loadApplications()
                      }}
                      className="hidden rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 sm:inline"
                    >
                      My Applications
                    </button>

                    <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                      Hi, {loggedInUser.name.split(' ')[0]}
                    </span>
                  </>
                )}

                {loggedInUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setShowAdminDashboard(true)
                      loadAdminApplications()
                    }}
                    className="hidden rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 sm:inline"
                  >
                    Recruitment
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Login
                </button>

                <button
                  onClick={openRegister}
                  className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-red-950 opacity-90" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">
              <Globe2 size={16} />
              Career opportunities in Luxembourg
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your future.
              <br />
              <span className="text-blue-400">Our mission.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Connect with career opportunities in Luxembourg and take the next
              step toward building your professional future.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#jobs"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-700"
              >
                Explore Jobs
                <ArrowRight size={18} />
              </a>

              <button
                onClick={openRegister}
                className="rounded-lg border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white hover:bg-white/20"
              >
                Create Applicant Account
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-6">
        <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200">

          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
              <Search className="text-slate-400" size={20} />

        <input
  type="text"
  placeholder="Job title or keyword"
  value={jobSearch}
  onChange={(e) => setJobSearch(e.target.value)}
  className="w-full outline-none"
/>
            </div>
<div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
  <MapPin className="text-slate-400" size={20} />

  <select
    value={jobLocation}
    onChange={(e) => setJobLocation(e.target.value)}
    className="w-full bg-transparent outline-none"
  >
    <option value="All Locations">All Locations</option>
    <option value="Luxembourg">Luxembourg</option>
    <option value="France">France</option>
    <option value="Germany">Germany</option>
    <option value="Belgium">Belgium</option>
  </select>
</div>
<div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
  <BriefcaseBusiness className="text-slate-400" size={20} />

  <select
    value={jobCategory}
    onChange={(e) => setJobCategory(e.target.value)}
    className="w-full bg-transparent outline-none"
  >
    <option value="All Categories">All Categories</option>
    <option value="Transport & Logistics">Transport & Logistics</option>
    <option value="Hospitality & Tourism">Hospitality & Tourism</option>
    <option value="Healthcare & Caregiving">Healthcare & Caregiving</option>
    <option value="Construction & Trades">Construction & Trades</option>
    <option value="Agriculture & Landscaping">Agriculture & Landscaping</option>
  </select>
</div>
<button
  type="button"
  onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
  className="rounded-lg bg-slate-900 px-7 py-3 font-semibold text-white hover:bg-slate-800"
>
  Search Jobs
</button>

          </div>
        </div>
      </section>

      {/* JOBS */}
      <section id="jobs" className="mx-auto max-w-7xl px-6 py-20">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Opportunities
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Featured jobs
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Explore available positions across some of Luxembourg's key
              employment sectors.
            </p>
          </div>

          <button className="flex items-center gap-2 font-semibold text-blue-700">
            View all jobs
            <ArrowRight size={18} />
          </button>

        </div>

        <div className="mt-10">
  <p className="mb-5 text-sm font-medium text-slate-500">
    {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
  </p>

          {filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <BriefcaseBusiness className="mx-auto h-12 w-12 text-slate-300" />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No jobs found
            </h3>

            <p className="mt-2 text-slate-500">
              Try changing your search, category, or location.
            </p>

            <button
              type="button"
              onClick={() => {
                setJobSearch('')
                setJobCategory('All Categories')
                setJobLocation('All Locations')
              }}
              className="mt-5 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Open
                  </span>
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-wide text-blue-700">
                  {job.category}
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {job.title}
                </h3>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {job.location}
                  </div>

                  <div className="font-semibold text-slate-900">
                    {job.salary} / month
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 font-semibold transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                >
                  View Position
                  <ArrowRight size={17} />
                </button>

              </div>
            ))}
     </div> 
    )} 
    </div>       
    </section>

      {/* PROCESS */}
      <section id="process" className="bg-white py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Simple process
            </p>

            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Start your journey
            </h2>

            <p className="mt-4 text-slate-600">
              Our platform is designed to make it easy for applicants to find
              opportunities and connect with our recruitment team.
            </p>

          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users size={23} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                1. Create your account
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Register with your email, phone number and personal details.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <BriefcaseBusiness size={23} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                2. Find a position
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Browse available opportunities and review the requirements
                before applying.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ShieldCheck size={23} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                3. Continue recruitment
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Contact our recruitment team through WhatsApp to continue the
                application process.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="bg-blue-700 py-20">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to explore your next opportunity?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create your applicant account and start exploring career
            opportunities in Luxembourg.
          </p>

          <button
            onClick={openRegister}
            className="mt-8 rounded-lg bg-white px-7 py-3.5 font-bold text-blue-700 hover:bg-slate-100"
          >
            Create Applicant Account
          </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-950 py-12 text-slate-300">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-10 md:grid-cols-3">

            <div>
              <div className="text-lg font-extrabold text-white">
                LUXEMBOURG CAREERLINK
              </div>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Connecting talent with career opportunities in Luxembourg.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white">
                Platform
              </h3>

              <div className="mt-4 space-y-2 text-sm">
                <div>Find Jobs</div>
                <div>Applicant Account</div>
                <div>Application Process</div>
                <div>Terms & Conditions</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white">
                Contact
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Our recruitment team will be available through WhatsApp for
                application support and next steps.
              </p>
            </div>

          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
            © 2026 Luxembourg CareerLink S.A R.L. All rights reserved.
          </div>

        </div>
      </footer>
      {/* RECRUITMENT DASHBOARD */}
{showAdminDashboard && loggedInUser && (
  <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-50">

    {/* Recruitment Header */}
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-blue-700">
            LUXEMBOURG CAREERLINK
          </p>

          <h1 className="mt-1 text-xl font-bold text-slate-900">
            Recruitment Dashboard
          </h1>
        </div>

        <button
          onClick={() => setShowAdminDashboard(false)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>

      </div>
    </header>

    {/* Recruitment Content */}
    <main className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Applications
        </h2>
{/* Job Management */}
<div className="mt-10 rounded-xl border border-slate-200 bg-white shadow-sm">

  <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <h3 className="font-bold text-slate-900">
        Job Management
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Create and manage job opportunities available to applicants.
      </p>
    </div>

    <button
  type="button"
  onClick={() => setShowJobForm(true)}
  className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
></button>

  </div>

  <div className="p-6">

  {showJobForm ? (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">

      <h3 className="text-lg font-bold text-slate-900">
        Add New Job
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Enter the details for the new job opportunity.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Job Title
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            placeholder="e.g. Delivery Driver"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Category
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          >
            <option>Transport & Logistics</option>
            <option>Hospitality & Tourism</option>
            <option>Healthcare & Caregiving</option>
            <option>Construction & Trades</option>
            <option>Agriculture & Landscaping</option>
            <option>Security</option>
            <option>Cleaning & Facilities</option>
            <option>Office & Administration</option>
            <option>IT & Digital</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Location
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          >
            <option>Luxembourg</option>
            <option>France</option>
            <option>Germany</option>
            <option>Belgium</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Salary
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            placeholder="e.g. €2,200–€2,700"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Description
          </label>
          <textarea
            rows="5"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Describe the job..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Requirements
          </label>
          <textarea
            rows="5"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            placeholder="List the requirements..."
          />
        </div>

      </div>

      <div className="mt-6 flex gap-3">

        <button
          type="button"
          onClick={() => setShowJobForm(false)}
          className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-white"
        >
          Cancel
        </button>

        <button
          type="button"
          className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Create Job
        </button>

      </div>

    </div>
  ) : (
    <p className="text-sm text-slate-500">
      Job management tools will appear here.
    </p>
  )}

</div>

</div>
        <p className="mt-2 text-sm text-slate-500">
          Review applications submitted by candidates.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Applications
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {adminApplications.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Submitted
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-700">
  {adminApplications.filter(
    application => application.status === 'Submitted'
  ).length}
</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Under Review
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {
              adminApplications.filter(
                application => application.status === 'Under Review'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Shortlisted
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              adminApplications.filter(
                application => application.status === 'Shortlisted'
              ).length
            }
          </p>
        </div>

      </div>

      {/* Applications List */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="font-bold text-slate-900">
            Candidate Applications
          </h3>
        </div>

        <div className="p-6">

          {adminLoading ? (

            <div className="py-12 text-center">
              <p className="font-semibold text-slate-600">
                Loading applications...
              </p>
            </div>

          ) : adminApplications.length === 0 ? (

            <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center">
              <p className="font-semibold text-slate-700">
                No applications found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Candidate applications will appear here.
              </p>
            </div>

          ) : (

            <div className="space-y-4">

              {adminApplications.map((application) => (

                <div
                  key={application.id}
                  className="rounded-xl border border-slate-200 p-5"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {application.applicant?.name || 'Unknown Applicant'}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        {application.jobTitle}
                      </p>
                    </div>

                    <select
  value={application.status}
  onChange={async (e) => {
    const newStatus = e.target.value

    try {
      const token = localStorage.getItem('careerlinkToken')

      const response = await fetch(
        `https://luxembourg-careerlink-api.onrender.com/api/admin/applications/${application.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to update application status.'
        )
      }

      setAdminApplications((currentApplications) =>
        currentApplications.map((item) =>
          item.id === application.id
            ? {
                ...item,
                status: data.application.status,
              }
            : item
        )
      )
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }}
  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
>
  <option value="Submitted">Submitted</option>
  <option value="Under Review">Under Review</option>
  <option value="Shortlisted">Shortlisted</option>
  <option value="Interview">Interview</option>
  <option value="Approved">Approved</option>
  <option value="Rejected">Rejected</option>
</select>

                  </div>

                  <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">

                    <div>
                      <p className="font-semibold text-slate-800">
                        Email
                      </p>
                      <p className="mt-1 text-slate-500">
                        {application.applicant?.email || 'Not available'}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Phone
                      </p>
                      <p className="mt-1 text-slate-500">
                        {application.applicant?.phone || 'Not available'}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Country
                      </p>
                      <p className="mt-1 text-slate-500">
                        {application.applicant?.country || 'Not available'}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Submitted
                      </p>
                      <p className="mt-1 text-slate-500">
                        {new Date(
                          application.submittedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">

                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-slate-800">
                        Position:
                      </span>{' '}
                      {application.jobTitle}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      <span className="font-semibold text-slate-800">
                        Location:
                      </span>{' '}
                      {application.location}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
      {/* JOB MANAGEMENT */}
      <div className="mt-10 rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Job Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage job opportunities available to applicants.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            + Add New Job
          </button>

        </div>

        <div className="p-6">
          <p className="text-sm text-slate-500">
            Job management tools will appear here.
          </p>
        </div>

      </div>
    </main>

  </div>
)}
      {/* APPLICANT DASHBOARD */}
      {showDashboard && loggedInUser && (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-50">

          {/* Dashboard Header */}
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

              <div>
                <div className="text-lg font-extrabold tracking-tight text-slate-900">
                  LUXEMBOURG <span className="text-blue-700">CAREERLINK</span>
                </div>

                <div className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                  APPLICANT DASHBOARD
                </div>
              </div>

              <button
                onClick={() => setShowDashboard(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to website
              </button>

            </div>
          </div>

          {/* Dashboard Content */}
          <main className="mx-auto max-w-7xl px-6 py-10">

            {/* Welcome */}
            <div className="rounded-2xl bg-slate-950 p-8 text-white shadow-lg">

              <p className="text-sm font-semibold text-blue-300">
                Applicant Portal
              </p>

              <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Welcome, {loggedInUser.name}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Manage your applicant profile, explore available positions,
                and continue your recruitment process.
              </p>

            </div>

            {/* Profile + Applications */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">

              {/* Profile */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-extrabold text-blue-700">
                    {loggedInUser.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      {loggedInUser.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      Applicant
                    </p>
                  </div>

                </div>

                <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {loggedInUser.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {loggedInUser.phone || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Country
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {loggedInUser.country || 'Not provided'}
                    </p>
                  </div>

                </div>

              </div>

           {/* Applications */}
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-extrabold">
        My Applications
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Track your recruitment applications.
      </p>
    </div>
  </div>

  <div className="mt-6">

    {applicationsLoading ? (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
        <p className="font-semibold text-slate-600">
          Loading your applications...
        </p>
      </div>

    ) : applications.length === 0 ? (

      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">

        <BriefcaseBusiness
          size={32}
          className="mx-auto text-slate-300"
        />

        <h3 className="mt-4 font-bold text-slate-800">
          No applications yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          When you apply for a position, your application status
          will appear here.
        </p>

        <button
          onClick={() => {
            setShowDashboard(false)
            document.getElementById('jobs')?.scrollIntoView({
              behavior: 'smooth',
            })
          }}
          className="mt-5 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Explore Jobs
        </button>

      </div>

    ) : (

      <div className="space-y-4">

        {applications.map((application) => (
          <div
            key={application.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {application.jobTitle}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {application.category}
                </p>
              </div>
    <div
  className={
    application.status === 'Approved'
      ? 'rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700'
      : application.status === 'Rejected'
        ? 'rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700'
        : application.status === 'Shortlisted'
          ? 'rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700'
          : application.status === 'Interview'
            ? 'rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700'
            : application.status === 'Under Review'
              ? 'rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700'
              : 'rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700'
  }
>
  {application.status}
</div>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">

              <div>
                <span className="font-semibold text-slate-800">
                  Salary
                </span>
                <p>{application.salary} / month</p>
              </div>

              <div>
                <span className="font-semibold text-slate-800">
                  Location
                </span>
                <p>{application.location}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-800">
                  Submitted
                </span>
                <p>
                  {new Date(application.submittedAt).toLocaleDateString()}
                </p>
              </div>

            </div>

          </div>
        ))}

        

                 <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="text-lg font-extrabold text-slate-900">
          Contact Recruitment
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          For next steps, recruitment instructions, or required documents,
          contact our recruitment team through WhatsApp.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/447311140315"
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-lg bg-green-600 px-5 py-3 text-center font-semibold text-white hover:bg-green-700"
          >
            WhatsApp: +44 7311 140315
          </a>

          <a
            href="https://wa.me/254103643715"
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-lg bg-green-600 px-5 py-3 text-center font-semibold text-white hover:bg-green-700"
          >
            WhatsApp: +254 103 643715
          </a>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Recruitment email:{' '}
          <a
            href="mailto:recruitment@luxembourgcareerlink.com"
            className="font-semibold text-blue-700 hover:underline"
          >
            recruitment@luxembourgcareerlink.com
          </a>
        </p>
      </div>
    </div>
    )}
  </div>
</div>
</div>
</main>
</div>
)}

{/* APPLICANT LOGIN */}
{showLogin && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
      <button
        type="button"
        onClick={() => setShowLogin(false)}
        className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
      >
        <X className="h-5 w-5" />
      </button>

      <h2 className="text-2xl font-extrabold text-slate-900">
        Applicant Login
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Sign in to manage your applications.
      </p>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Enter your password"
            required
          />
        </div>

        {loginMessage && (
          <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {loginMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loginLoading}
          className="w-full rounded-lg bg-blue-700 px-5 py-3.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {loginLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => {
            setShowLogin(false)
            openRegister()
          }}
          className="font-semibold text-blue-700 hover:underline"
        >
          Create Account
        </button>
      </p>
    </div>
  </div>
)}


{/* APPLICANT LOGIN */}
{showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) closeLogin() }}>
          <section role="dialog" aria-modal="true" aria-labelledby="login-title" className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl sm:p-9">
            <button type="button" onClick={closeLogin} aria-label="Close login" className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
              <X size={21} />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <ShieldCheck size={24} />
            </div>
            <h2 id="login-title" className="mt-5 text-2xl font-extrabold">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Log in to your Luxembourg CareerLink applicant account.</p>
            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold">Email address</label>
                <input id="login-email" type="email" name="email" value={loginForm.email} onChange={handleLoginChange} autoComplete="email" required placeholder="you@example.com" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold">Password</label>
                <input id="login-password" type="password" name="password" value={loginForm.password} onChange={handleLoginChange} autoComplete="current-password" required placeholder="Enter your password" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
              </div>
              {loginMessage && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{loginMessage}</div>}
              <button type="submit" disabled={loginLoading} className="w-full rounded-lg bg-blue-700 px-5 py-3.5 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
              <p className="text-center text-sm text-slate-600">New to CareerLink? <button type="button" onClick={() => { closeLogin(); openRegister() }} className="font-semibold text-blue-700 hover:text-blue-800">Create an account</button></p>
            </form>
          </section>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {showRegister && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4">

          <div className="relative max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <button
              onClick={closeRegister}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={21} />
            </button>

            <div className="p-7 sm:p-9">

              {!registered ? (
                <>
                  <div className="mb-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <UserPlus size={24} />
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold">
                      Create your applicant account
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Create an account to explore jobs and manage your
                      recruitment applications.
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold">
                        Full name
                      </label>

                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold">
                        Email address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold">
                        Phone / WhatsApp number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="+250 7XX XXX XXX"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold">
                        Country
                      </label>

                      <input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        required
                        placeholder="Your country"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold">
                        Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />

                      <p className="mt-1.5 text-xs text-slate-500">
                        Your password must contain at least 8 characters.
                      </p>
                    </div>

                    {message && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-blue-700 px-5 py-3.5 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-xs leading-5 text-slate-500">
                      By creating an account, you agree to our Terms &
                      Conditions and Privacy Policy.
                    </p>

                  </form>
                </>
              ) : (
                <div className="py-8 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <CheckCircle2 size={34} />
                  </div>

                  <h2 className="mt-6 text-2xl font-extrabold">
                    Account created!
                  </h2>

                  <p className="mt-3 text-slate-600">
                    Your Luxembourg CareerLink applicant account has been
                    created successfully.
                  </p>

                 

                  <button
                    onClick={closeRegister}
                    className="mt-7 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                  >
                    Continue
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default App