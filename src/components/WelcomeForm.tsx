import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Rocket, Brain, Zap, ArrowRight } from "lucide-react";

const WelcomeForm = () => {
  const { setUser, loginUser } = useUser();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [step, setStep] = useState<"name" | "registration">("name");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const grades = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("Please enter your first name");
      return;
    }

    if (!lastName.trim()) {
      setError("Please enter your last name");
      return;
    }

    setIsChecking(true);
    try {
      // Check if user exists
      const userExists = await loginUser(firstName.trim(), lastName.trim());
      
      if (userExists) {
        // User found, they're automatically logged in
        toast({
          title: "Welcome back! 🎉",
          description: `Great to see you again, ${firstName}! Your progress has been loaded.`,
        });
        // The loginUser function already handles setting the user state
        return;
      } else {
        // User doesn't exist, show registration fields
        setStep("registration");
      }
    } catch (err) {
      setError("Failed to check your information. Please try again.");
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!grade) {
      setError("Please select your grade");
      return;
    }

    if (!school.trim()) {
      setError("Please enter your school name");
      return;
    }

    setIsLoading(true);
    try {
      await setUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        grade,
        school: school.trim(),
      });
    } catch (err) {
      setError("Failed to save your information. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  } as const;

  const floatingShapes = [
    { icon: Rocket, delay: 0, x: "10%", y: "20%" },
    { icon: Brain, delay: 1, x: "85%", y: "30%" },
    { icon: Zap, delay: 2, x: "15%", y: "70%" },
    { icon: Sparkles, delay: 1.5, x: "80%", y: "75%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      {floatingShapes.map((shape, index) => {
        const Icon = shape.icon;
        return (
          <motion.div
            key={index}
            className="absolute opacity-20 dark:opacity-10"
            style={{ left: shape.x, top: shape.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.2, 1],
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              delay: shape.delay,
              ease: "easeInOut",
            }}
          >
            <Icon className="h-12 w-12 text-primary" />
          </motion.div>
        );
      })}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.6,
        }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-elevated border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            {/* Animated icon */}
            <motion.div
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-glow relative"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-10 w-10 text-white" />
              {/* Pulsing ring effect */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/50"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome to AI Literacy Initiative for Young Learners!
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Let's get started by telling us a bit about yourself
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
            {step === "name" ? (
              <motion.form
                key="name-form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleNameSubmit}
                className="space-y-5"
              >
                <motion.div
                  variants={itemVariants}
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Label htmlFor="firstName" className="text-sm font-semibold">
                    First Name *
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isChecking || isLoading}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Label htmlFor="lastName" className="text-sm font-semibold">
                    Last Name *
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isChecking || isLoading}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </motion.div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isChecking || isLoading}
                      size="lg"
                    >
                      {isChecking ? (
                        <motion.span
                          className="flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </motion.span>
                      ) : (
                        <motion.span
                          className="flex items-center justify-center gap-2"
                          whileHover={{ gap: 8 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            ) : (
              <motion.form
                key="registration-form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onSubmit={handleRegistrationSubmit}
                className="space-y-5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/20 p-4 rounded-lg mb-4"
                >
                  <p className="text-sm text-center">
                    <strong>Welcome, {firstName} {lastName}!</strong> We couldn't find you in our system. 
                    Please complete your registration below.
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Label htmlFor="grade" className="text-sm font-semibold">
                    Grade *
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Select value={grade} onValueChange={setGrade} disabled={isLoading} required>
                      <SelectTrigger
                        id="grade"
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                      >
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Label htmlFor="school" className="text-sm font-semibold">
                    School *
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Input
                      id="school"
                      type="text"
                      placeholder="Enter your school name"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      disabled={isLoading}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </motion.div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <motion.span
                          className="flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Getting Started...
                        </motion.span>
                      ) : (
                        <motion.span
                          className="flex items-center justify-center gap-2"
                          whileHover={{ gap: 8 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          Complete Registration
                          <Rocket className="h-4 w-4" />
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={() => setStep("name")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                >
                  ← Back to name entry
                </motion.button>

                <motion.p
                  variants={itemVariants}
                  className="text-xs text-center text-muted-foreground"
                >
                  Your information will be stored securely and used to track your progress
                </motion.p>
              </motion.form>
            )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WelcomeForm;

