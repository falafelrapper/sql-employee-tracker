-- Seeds for schema
INSERT INTO department (name)
VALUES ("Research and Development"),
       ("Human Resources"),
       ("Front End Development"),
       ("UI/UX");


INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Research", 120000, 1),
       ("Lead Developer", 140000, 1),
       ("HR Representative", 80000, 2),
       ("HR Assistant", 60000, 2),
       ("HTML Developer", 100000, 3),
       ("CSS Developer", 100000, 3),
       ("JavaScript Developer", 100000, 3),
       ("UI Designer", 110000, 4),
       ("UX Designer", 110000, 4);

INSERT INTO employee (first_name, last_name, roles_id)
VALUES ("Zachary", "Roy", 2),
       ("Larry", "Alvarez", 3),
       ("Hannah", "Burkhart", 2),
       ("Harry", "Manson", 2),
       ("Jennifer", "Cuevas", 3),
       ("Wendy", "Mercado", 3),
       ("Darlene", "Cadenas", 3),
       ("Yosuke", "Kitagawa", 4),
       ("Fumiko", "Hanazawa", 4),
       ("Craig", "Hammond", 2),
       ("Leonard", "Sanchez", 3),
       ("Mary", "Clarkson", 2),
       ("Randy", "Bend", 2);