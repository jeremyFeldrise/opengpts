import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { useQuery } from 'react-query'
import { loginUser } from '../api/auth'
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, ArrowRightIcon, Mail } from 'lucide-react'
import { Alert } from './alert'
import bgImage from "../assets/images/picture.png"

function GoogleSvg() {
  return (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
      <path fill="none" d="M1 1h22v22H1z" />
    </svg>
  )
}

const slideContent = [
  {
    rate: 1,
    testimoniale: "Lorem ipsum dolor sit amet consectetur. Laoreet tristique id nec suspendisse pulvinar sapien. Posuere pharetra elementum posuere interdum in ipsum orci. Blandit pretium gravida malesuada purus id eget bibendum sagittis cursus. Ut cursus facilisis nulla enim.",
    name: "John Doe",
    post: "Marketing Director"
  },
  {
    rate: 1,
    testimoniale: "Lorem ipsum dolor sit amet consectetur. Laoreet tristique id nec suspendisse pulvinar sapien. Posuere pharetra elementum posuere interdum in ipsum orci. Blandit pretium gravida malesuada purus id eget bibendum sagittis cursus. Ut cursus facilisis nulla enim.",
    name: "John Doe",
    post: "Marketing Director"
  },
  {
    rate: 1,
    testimoniale: "Lorem ipsum dolor sit amet consectetur. Laoreet tristique id nec suspendisse pulvinar sapien. Posuere pharetra elementum posuere interdum in ipsum orci. Blandit pretium gravida malesuada purus id eget bibendum sagittis cursus. Ut cursus facilisis nulla enim.",
    name: "John Doe",
    post: "Marketing Director"
  },
]

export default function Login() {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [signUpForm, setSignUpForm] = useState(false)
  const [errors, setErrors] = useState('')
  const [email, setEmail] = useState('')
  const [email2, setEmail2] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [betaResponse, setBetaResponse] = useState<string | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const navigate = useNavigate()
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const updateButtons = useCallback((embla: any) => {
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['loginStatus', email, password],
    queryFn: () => loginUser(email, password),
    enabled: false,
    onSuccess: (data) => {
      if (data?.jwt_token) {
        localStorage.setItem('token', data.jwt_token)
        setIsLoggedIn(true)
        console.log('Logged in successfully!')

      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await refetch()
  }

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/google/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      // console.log('Google Sign In response:', await response.json())
      // window.location.href = (await response.json()).url
      window.location.href = await response.json()
    } catch (error) {
      console.error('Failed to sign in with Google');
      return null;
    }
  }

  const handleBetaSignup = async () => {
    try {
      const response = await fetch('https://hook.eu2.make.com/dx9hm8fbhl74f1ezo123sc03h5de7j62', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email2 }),
      })

      if (!response.ok) {
        throw new Error('Failed to register. Please try again later.')
      }

      const responseText = await response.text()
      setBetaResponse('Thank you for signing up! We have received your email.')
    } catch (error) {
      console.error('Error sending email to webhook:', error)
      setBetaResponse('Failed to register. Please try again later.')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined') {
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/project')
    }
  }, [isLoggedIn, navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (data?.isLoggedIn) {
    return <div>You are already logged in!</div>
  }

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col justify-center h-screen">
        <div className="max-w-[576px] m-auto w-full">
          {
            !signUpForm ? (
              <>
                <div className="text-3xl text-center font-semibold mb-6">Welcome Back</div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Button type="submit" className="w-full" rightElem={<ArrowRightIcon />}>Sign In</Button>
                    </div>
                    <div className="flex items-center my-6">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="mx-4 text-gray-500">OR</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div>
                      <Button variant="outline" className="w-full">Sign in with Google <GoogleSvg /></Button>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div>Don't have an account ? <button onClick={() => {
                        setSignUpForm(true)
                        setErrors('')
                      }} className="underline text-purple-500">Sign Up</button></div>
                      <div><a href="#" className="underline text-purple-500">Forgot Password</a></div>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="text-3xl text-center font-semibold mb-6">Welcome to Content Genius</div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm Password</Label>
                      <Input
                        id="confirm"
                        name="confirm"
                        placeholder="Confirm your password"
                        type="password"
                      />
                    </div>
                    <div>
                      <Button type="submit" className="w-full" rightElem={<ArrowRightIcon />}>Sign Up</Button>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div><div onClick={() => {
                        setSignUpForm(false)
                        setErrors('')
                      }} className="underline text-purple-500">Back to login</div></div>
                    </div>
                  </div>
                </form>
              </>
            )
          }
          {
            errors.length > 0 && (<Alert variant="error" className="mt-4">{errors}</Alert>)
          }
        </div>
      </div>
      <div className="flex flex-col h-screen bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="flex flex-col justify-between flex-grow max-w-[616px] w-full m-10">
          <div>
            <div className="text-2xl font-semibold mb-4">Unify your business intelligence with a single powerful AI platform</div>
            <div className="text-base">Epsimo AI centralizes your marketing and sales operations through customizable AI agents that learn your business. Create specialized assistants that automate complex tasks, capture unique insights, and seamlessly integrate with your existing tools. </div>
          </div>
          <div className="relative">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {
                  slideContent.map((item, i) => (
                    <div key={item.name + i} className="embla__slide">
                      <div className="text-sm mb-4">{item.testimoniale}</div>
                      <div className="text-base">{item.name}</div>
                      <div className="text-sm">{item.post}</div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="-translate-y-1/2 disabled:opacity-50"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="-translate-y-1/2 disabled:opacity-50"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
