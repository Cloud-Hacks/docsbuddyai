import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu";

const AboutPage = () => {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-100 to-yellow-100 flex flex-col items-center">
      <div className="flex justify-center items-center w-full h-16 bg-black">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4 text-white">
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="hover:text-gray-400 p-2">
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about" className="hover:text-gray-400 p-2">
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/contact" className="hover:text-gray-400 p-2">
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>

      <div className="max-w-4xl mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-4">About DocsBuddy</h1>
        <p className="text-lg text-gray-700 mb-4">
        DocsBuddy is a powerful tool designed to assist users in managing, searching, and processing documentation and knowledge resources through an intelligent and user-friendly interface.
        </p>
        <h2 className="text-2xl font-bold mb-2">Our Inspiration</h2>
        <p className="text-lg text-gray-700 mb-4">
        DocsBuddy addresses several key challenges faced by individuals and organizations in managing, retrieving, and gaining insights from large volumes of documentation and knowledge resources.
        </p>
        <p className="text-lg text-gray-700 mb-4">
        Here’s why DocsBuddy is needed and the specific problems it solves. e.g. in many fields, documentation, knowledge resources, and records grow rapidly, making it hard for users to find the exact information they need.
        </p>
        <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
        <p className="text-lg text-gray-700 mb-4">
        DocsBuddy’s AI-powered vector search enables semantic searches, understanding the meaning behind a query rather than just matching keywords. This allows users to find relevant information more efficiently, even if they don’t use exact terms, improving search accuracy and relevancy.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
