def get_costs(name: str):
    costs = 0
    count = 0
    while True:
        try:
            cost = input(
                f"Enter costs for {name}: ")
            if cost == '':
                break
            count += 1
            costs += float(cost)
        except ValueError:
            print("Please enter a number.")
            continue
        print("\033[1A\033[K" + name.capitalize() + " item " +
              str(count+1) + ": £" + "{:.2f}".format(float(cost)))

    # This deletes the current line so there are not extra prompts
    print("\033[1A\033[K", end="")
    if count > 1:
        print(f"{name.capitalize()} total: {costs}")
    return costs


error = True
while error:
    error = False
    people_string = input("Who is ordering? (l, s, d or j) ")
    if len(people_string) == 0:
        print("No input given")
        error = True
    people = {}
    for person in people_string:
        if person == "l":
            people['Leena'] = None
        elif person == "s":
            people['Sophie'] = None
        elif person == "d":
            people['Dan'] = None
        elif person == "j":
            people['Jamie'] = None
        else:
            print("Invalid input")
            error = True
num = len(people)

order_cost = float(
    input("Enter subtotal: "))

promotion = input("Enter promotion as percentage: ")
promotion_max = int(input("Enter maximum promotion (0 for no limit): "))

if "%" in promotion:
    promotion = float(promotion.replace("%", "")) / 100
else:
    promotion = float(promotion) / 100

service_costs_raw = get_costs("service/delivery")
service_costs = service_costs_raw / num
calculate_promotion = order_cost > promotion_max/promotion

shared_raw = get_costs("shared items")
if calculate_promotion:
    shared = (shared_raw - (shared_raw/order_cost * promotion_max)) / num
else:
    shared = (shared_raw * (1-promotion)) / num

for person in people:
    costs = get_costs(person)
    if calculate_promotion:
        costs -= costs/order_cost * promotion_max
    else:
        costs = costs * (1-promotion)

    people[person] = round(costs + service_costs + shared, 2)

totals = list(map(lambda x: f"{x[0]} owes {x[1]}", people.items()))
totals.append(f"Total: {round(sum(people.values()), 2)}")
print('\n'.join(totals))
