"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import Link from "next/link";
import { ArrowRight, CheckCircle, BookOpen, Award, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.role === "teacher") {
      router.push("/teacher/create-exam");
    } else if (user.role === "student") {
      router.push("/student");
    } else if (user.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Шалгалтын олон төрөл",
      description: "Сонгодог, олон сонголттой, дүрслэлтэй асуултууд, кодын асуултууд"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Автомат үнэлгээ",
      description: "Шууд үр дүн, автомат оноожуулалт, дүгнэлт"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Хугацаатай тест",
      description: "Зохистой хугацаатай, дуусах цагийн тоолуур, хугацаа хянагч"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Аюулгүй байдал",
      description: "Шалгалтын түлхүүр, сурагчийн бүртгэл, хуулбарлах хамгаалалт"
    }
  ];

  const testimonials = [
    {
      quote: "Энэ платформ манай багш нарын шалгалт авах ажлыг маш хялбарчилсан.",
      name: "Б. Сод-Од",
      title: "Нэст Эдүкэйшн Сургуулийн захирал"
    },
    {
      quote: "Оюутнуудын шалгалтын үр дүнг хянах, дүгнэх нь одоо хэд дахин хурдан болсон.",
      name: "Д. Цэцэгмаа",
      title: "Багш"
    },
    {
      quote: "Миний суралцах чадварт үнэхээр их тусалж байна. Гайхалтай систем.",
      name: "Г. Билгүүн",
      title: "Оюутан"
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-lime-800 text-white py-20">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <motion.div 
              className="lg:w-1/2 mb-10 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Онлайн шалгалтын платформ</h1>
              <p className="text-xl mb-8 text-green-100">
                Орчин үеийн, аюулгүй, хэрэглэхэд хялбар онлайн шалгалтын систем. Багш, сурагч хоёулаа ашиглахад таатай.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition duration-300 text-center"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-3 bg-green-500 border border-white/20 rounded-lg font-semibold hover:bg-green-600 transition duration-300 flex items-center justify-center"
                >
                  Бүртгүүлэх <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                <img 
                  src="/exam-dashboard.png" 
                  alt="Exam Dashboard" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = "/examination.png";
                  }}
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-green-500 rounded-lg px-4 py-2 shadow-lg">
                <p className="font-bold">Одоо туршиж үзээрэй!</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Давуу талууд</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Хялбар, үр дүнтэй, аюулгүй шалгалтын системийг бид танд санал болгож байна
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="bg-green-100 text-green-600 p-3 inline-block rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Хэрхэн ажилладаг вэ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Бидний онлайн шалгалтын систем нь маш хялбар ашиглагдах боломжтой
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-green-200 -translate-y-1/2"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Бүртгүүлэх",
                  description: "Багш эсвэл сурагчаар бүртгүүлж системд нэвтэрнэ"
                },
                {
                  step: "02",
                  title: "Шалгалт бэлтгэх/өгөх",
                  description: "Багш нар шалгалт үүсгэж, сурагчид шалгалтыг өгнө"
                },
                {
                  step: "03",
                  title: "Үр дүнг харах",
                  description: "Шалгалтын дүн, оноо, дүгнэлтийг харах боломжтой"
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white rounded-xl p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                >
                  <div className="bg-green-600 text-white text-xl font-bold h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-green-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Хэрэглэгчдийн сэтгэгдэл</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Манай системийг ашиглаж буй хүмүүсийн сэтгэгдлүүд
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="text-green-500 mb-4 text-5xl font-serif">"</div>
                <p className="text-gray-600 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold">Бэлэн үү? Яг одоо эхлэх!</h2>
              <p className="text-green-200 mt-2">
                Өнөөдөр бүртгүүлж шалгалтын процессоо хялбарчил.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/login"
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Нэвтрэх
              </Link>
              <Link 
                href="/register"
                className="bg-green-600 border border-white/20 px-8 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors"
              >
                Үнэгүй бүртгүүлэх
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white font-semibold mb-4">Бидний тухай</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Танилцуулга</a></li>
                <li><a href="#" className="hover:text-white transition">Багийн гишүүд</a></li>
                <li><a href="#" className="hover:text-white transition">Түүх</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Бүтээгдэхүүн</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Онлайн шалгалт</a></li>
                <li><a href="#" className="hover:text-white transition">Дүн шинжилгээ</a></li>
                <li><a href="#" className="hover:text-white transition">Үнэ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Дэмжлэг</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Заавар</a></li>
                <li><a href="#" className="hover:text-white transition">Түгээмэл асуултууд</a></li>
                <li><a href="#" className="hover:text-white transition">Тусламж</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Холбоо барих</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Имэйл</a></li>
                <li><a href="#" className="hover:text-white transition">Утас</a></li>
                <li><a href="#" className="hover:text-white transition">Хаяг</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-sm text-center">
            <p>© {new Date().getFullYear()} Online Examination Platform. Бүх эрх хамгаалагдсан.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
