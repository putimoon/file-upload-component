package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Post("/upload", func(c *fiber.Ctx) error {
		file, err := c.FormFile("file")
		if err != nil {
			return err
		}

		destination := fmt.Sprintf("./uploads/%s", file.Filename)
		if err := c.SaveFile(file, destination); err != nil {
			return err
		}

		return nil
	})

	app.Listen(":8000")
}
